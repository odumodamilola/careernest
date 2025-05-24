import { useState } from 'react';
import { X } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

interface AddCertificateModalProps {
  onClose: () => void;
}

export function AddCertificateModal({ onClose }: AddCertificateModalProps) {
  const { updateProfile } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    credentialUrl: '',
    skills: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real app, we would add this certificate to the user's profile
      await updateProfile({
        certificates: [
          {
            id: `cert-${Date.now()}`,
            ...formData,
          },
        ],
      });
      onClose();
    } catch (error) {
      console.error('Failed to add certificate:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      skills: e.target.value.split(',').map((skill) => skill.trim()),
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between pb-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Add Certificate
              </h3>
              <button
                onClick={onClose}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Certificate Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="input mt-1"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="issuer"
                  className="block text-sm font-medium text-gray-700"
                >
                  Issuing Organization
                </label>
                <input
                  type="text"
                  id="issuer"
                  value={formData.issuer}
                  onChange={(e) =>
                    setFormData({ ...formData, issuer: e.target.value })
                  }
                  className="input mt-1"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="issueDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Issue Date
                  </label>
                  <input
                    type="date"
                    id="issueDate"
                    value={formData.issueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, issueDate: e.target.value })
                    }
                    className="input mt-1"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="expiryDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Expiry Date (Optional)
                  </label>
                  <input
                    type="date"
                    id="expiryDate"
                    value={formData.expiryDate}
                    onChange={(e) =>
                      setFormData({ ...formData, expiryDate: e.target.value })
                    }
                    className="input mt-1"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="credentialUrl"
                  className="block text-sm font-medium text-gray-700"
                >
                  Credential URL
                </label>
                <input
                  type="url"
                  id="credentialUrl"
                  value={formData.credentialUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, credentialUrl: e.target.value })
                  }
                  className="input mt-1"
                  placeholder="https://example.com/verify/..."
                />
              </div>

              <div>
                <label
                  htmlFor="skills"
                  className="block text-sm font-medium text-gray-700"
                >
                  Skills (comma-separated)
                </label>
                <textarea
                  id="skills"
                  value={formData.skills.join(', ')}
                  onChange={handleSkillsChange}
                  className="input mt-1"
                  placeholder="e.g., React, TypeScript, Node.js"
                />
              </div>

              <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full px-4 py-2 sm:col-start-2"
                >
                  {loading ? 'Adding...' : 'Add Certificate'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-outline mt-3 w-full px-4 py-2 sm:col-start-1 sm:mt-0"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}