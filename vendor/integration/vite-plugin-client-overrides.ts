import * as fs from 'fs';
import * as path from 'path';
import type { Plugin } from 'vite';

/**
 * Vite plugin that automatically resolves component imports to client overrides when they exist.
 *
 * When you import from ~/components/*, this plugin checks if a corresponding file exists
 * in src/client/components/*. If it does, the import resolves to the client version.
 * Otherwise, it resolves to the base component.
 *
 * Example:
 * - Import: ~/components/ui/Button.astro
 * - Client override exists: src/client/components/ui/Button.astro
 * - Result: Resolves to client version automatically
 *
 * This makes the component override system work as documented, where creating a file
 * in src/client/components/ automatically overrides the base component without needing
 * to update imports throughout the codebase.
 */
export default function clientOverridesPlugin(): Plugin {
  let projectRoot: string;

  return {
    name: 'vite-plugin-client-overrides',

    configResolved(config) {
      // Store the project root for path resolution
      projectRoot = config.root;
    },

    resolveId(source: string, _importer: string | undefined) {
      // Only process imports that match ~/components/*
      if (!source.startsWith('~/components/')) {
        return null; // Let Vite handle other imports
      }

      // Extract the relative path from ~/components/
      // Example: ~/components/ui/Button.astro -> ui/Button.astro
      const relativePath = source.replace('~/components/', '');

      // Build the client override path
      const clientPath = path.resolve(projectRoot, 'src', 'client', 'components', relativePath);

      // Check if client override exists (try all possible extensions)
      const extensions = ['', '.astro', '.ts', '.tsx', '.js', '.jsx'];

      for (const ext of extensions) {
        // If we're checking without extension and the path already has one, use as-is
        if (ext === '' && path.extname(clientPath)) {
          if (fs.existsSync(clientPath)) {
            // Client override exists! Resolve to client path
            return clientPath;
          }
        } else if (ext !== '') {
          // Strip existing extension if present, then add new one
          const pathWithoutExt = clientPath.replace(/\.[^.]+$/, '');
          const testPath = pathWithoutExt + ext;

          if (fs.existsSync(testPath)) {
            // Client override exists! Resolve to client path
            return testPath;
          }
        }
      }

      // No client override found, let Vite resolve to base component
      return null;
    }
  };
}
