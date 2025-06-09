// WebRTC service for video/audio calls
export class WebRTCService {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private onRemoteStreamCallback: ((stream: MediaStream) => void) | null = null;
  private onCallEndCallback: (() => void) | null = null;

  private configuration: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  constructor() {
    this.setupPeerConnection();
  }

  private setupPeerConnection() {
    this.peerConnection = new RTCPeerConnection(this.configuration);

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        // Send ICE candidate to remote peer via signaling server
        this.sendSignal({
          type: 'ice-candidate',
          candidate: event.candidate
        });
      }
    };

    this.peerConnection.ontrack = (event) => {
      this.remoteStream = event.streams[0];
      if (this.onRemoteStreamCallback) {
        this.onRemoteStreamCallback(this.remoteStream);
      }
    };

    this.peerConnection.onconnectionstatechange = () => {
      if (this.peerConnection?.connectionState === 'disconnected' || 
          this.peerConnection?.connectionState === 'failed') {
        this.endCall();
      }
    };
  }

  async startCall(video: boolean = true, audio: boolean = true): Promise<void> {
    try {
      // Get user media
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video,
        audio
      });

      // Add tracks to peer connection
      this.localStream.getTracks().forEach(track => {
        if (this.peerConnection && this.localStream) {
          this.peerConnection.addTrack(track, this.localStream);
        }
      });

      // Create offer
      const offer = await this.peerConnection!.createOffer();
      await this.peerConnection!.setLocalDescription(offer);

      // Send offer to remote peer
      this.sendSignal({
        type: 'offer',
        offer: offer
      });

      return this.localStream;
    } catch (error) {
      console.error('Error starting call:', error);
      throw error;
    }
  }

  async answerCall(offer: RTCSessionDescriptionInit): Promise<MediaStream> {
    try {
      // Get user media
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      // Add tracks to peer connection
      this.localStream.getTracks().forEach(track => {
        if (this.peerConnection && this.localStream) {
          this.peerConnection.addTrack(track, this.localStream);
        }
      });

      // Set remote description
      await this.peerConnection!.setRemoteDescription(offer);

      // Create answer
      const answer = await this.peerConnection!.createAnswer();
      await this.peerConnection!.setLocalDescription(answer);

      // Send answer to remote peer
      this.sendSignal({
        type: 'answer',
        answer: answer
      });

      return this.localStream;
    } catch (error) {
      console.error('Error answering call:', error);
      throw error;
    }
  }

  async handleSignal(signal: any): Promise<void> {
    try {
      switch (signal.type) {
        case 'offer':
          await this.peerConnection!.setRemoteDescription(signal.offer);
          break;
        
        case 'answer':
          await this.peerConnection!.setRemoteDescription(signal.answer);
          break;
        
        case 'ice-candidate':
          await this.peerConnection!.addIceCandidate(signal.candidate);
          break;
      }
    } catch (error) {
      console.error('Error handling signal:', error);
    }
  }

  toggleVideo(): boolean {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        return videoTrack.enabled;
      }
    }
    return false;
  }

  toggleAudio(): boolean {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        return audioTrack.enabled;
      }
    }
    return false;
  }

  async shareScreen(): Promise<MediaStream | null> {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });

      // Replace video track
      const videoTrack = screenStream.getVideoTracks()[0];
      const sender = this.peerConnection!.getSenders().find(s => 
        s.track && s.track.kind === 'video'
      );

      if (sender) {
        await sender.replaceTrack(videoTrack);
      }

      // Handle screen share end
      videoTrack.onended = () => {
        this.stopScreenShare();
      };

      return screenStream;
    } catch (error) {
      console.error('Error sharing screen:', error);
      return null;
    }
  }

  async stopScreenShare(): Promise<void> {
    try {
      // Get camera stream again
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });

      const videoTrack = cameraStream.getVideoTracks()[0];
      const sender = this.peerConnection!.getSenders().find(s => 
        s.track && s.track.kind === 'video'
      );

      if (sender) {
        await sender.replaceTrack(videoTrack);
      }

      // Update local stream
      if (this.localStream) {
        const oldVideoTrack = this.localStream.getVideoTracks()[0];
        this.localStream.removeTrack(oldVideoTrack);
        this.localStream.addTrack(videoTrack);
      }
    } catch (error) {
      console.error('Error stopping screen share:', error);
    }
  }

  endCall(): void {
    // Stop all tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach(track => track.stop());
      this.remoteStream = null;
    }

    // Close peer connection
    if (this.peerConnection) {
      this.peerConnection.close();
      this.setupPeerConnection(); // Reset for next call
    }

    // Notify about call end
    this.sendSignal({ type: 'call-end' });
    
    if (this.onCallEndCallback) {
      this.onCallEndCallback();
    }
  }

  onRemoteStream(callback: (stream: MediaStream) => void): void {
    this.onRemoteStreamCallback = callback;
  }

  onCallEnd(callback: () => void): void {
    this.onCallEndCallback = callback;
  }

  private sendSignal(signal: any): void {
    // This should be implemented to send signals via your signaling server
    // For now, we'll use the RealtimeService
    console.log('Sending signal:', signal);
  }

  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  getRemoteStream(): MediaStream | null {
    return this.remoteStream;
  }
}