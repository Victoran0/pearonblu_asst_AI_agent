export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo / Brand */}
          <div className="mb-4 md:mb-0">
            <a href="/" className="text-xl font-bold text-gray-800 dark:text-white">
              Pearon Blu
            </a>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-6">
            <a
              href="#about"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
            >
              About
            </a>
            <a
              href="#services"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
            >
              Services
            </a>
            <a
              href="#blog"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
            >
              Blog
            </a>
            <a
              href="#contact"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
            >
              Contact
            </a>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="flex justify-center md:justify-end space-x-6 mt-6">
          <a
            href="https://facebook.com"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
            aria-label="Facebook"
          >
            <svg
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.293H9.692v-3.622h3.127V8.413c0-3.1 1.894-4.788 4.658-4.788 1.325 0 2.464.099 2.795.144v3.24h-1.917c-1.505 0-1.796.715-1.796 1.764v2.311h3.591l-.467 3.622h-3.124V24h6.116c.73 0 1.325-.593 1.325-1.325V1.325C24 .593 23.407 0 22.675 0z" />
            </svg>
          </a>
          <a
            href="https://twitter.com"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
            aria-label="Twitter"
          >
            <svg
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M24 4.557a9.828 9.828 0 0 1-2.828.775 4.92 4.92 0 0 0 2.165-2.724 9.85 9.85 0 0 1-3.127 1.195 4.916 4.916 0 0 0-8.374 4.482A13.94 13.94 0 0 1 1.671 3.149a4.913 4.913 0 0 0 1.523 6.573 4.902 4.902 0 0 1-2.229-.616v.062a4.917 4.917 0 0 0 3.946 4.827 4.902 4.902 0 0 1-2.224.084 4.918 4.918 0 0 0 4.596 3.417A9.866 9.866 0 0 1 .605 19.28a13.94 13.94 0 0 0 7.548 2.211c9.058 0 14.01-7.506 14.01-14.01 0-.213-.005-.425-.014-.637A9.998 9.998 0 0 0 24 4.557z" />
            </svg>
          </a>
          <a
            href="https://linkedin.com"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
            aria-label="LinkedIn"
          >
            <svg
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M22.23 0H1.77C.79 0 0 .774 0 1.725v20.55C0 23.227.79 24 1.77 24h20.46c.98 0 1.77-.773 1.77-1.725V1.725C24 .774 23.21 0 22.23 0zM7.081 20.452H3.577V9.03h3.504v11.422zM5.329 7.504a2.018 2.018 0 1 1 0-4.036 2.018 2.018 0 0 1 0 4.036zm15.123 12.948h-3.504v-5.841c0-1.39-.028-3.178-1.938-3.178-1.939 0-2.238 1.515-2.238 3.079v5.94h-3.505V9.03h3.367v1.553h.048c.47-.893 1.619-1.833 3.336-1.833 3.57 0 4.229 2.35 4.229 5.408v6.294z" />
            </svg>
          </a>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Pearon Blu. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
