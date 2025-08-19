export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-default-50 dark:bg-default-100/50 border-t border-divider">
      <div className="w-full px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-default-600 text-sm">
              © {currentYear} Foodie. Tous droits réservés.
            </p>
            <div className="flex items-center gap-4 text-sm text-default-600">
              <span>Made with ❤️ for food lovers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
