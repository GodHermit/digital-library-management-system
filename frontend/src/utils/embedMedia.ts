import { Image } from 'mdast';
import { visit } from 'unist-util-visit';

export interface EmbedMediaOptions {
  embeddedMedia: boolean;
  useRelativePath?: boolean;
  pathReplace?: string;
};

export default function embedMedia(options: EmbedMediaOptions): import('unified').Transformer {
  return (tree, _file, done) => {
    // Embed images
    let count = 0;
    visit(tree, 'image', (node: Image) => {
      // Count the amount of images
      if (node.url) {
        count++;
      }
    });

    // If there are no images, we can skip the rest
    if (!count) {
      done();
    }

    visit(tree, 'image', (node: Image) => {
      // If the settings are set to not embed images and not use relative paths
      if (!options.embeddedMedia && !options.useRelativePath) {
        node.url = new URL(node.url, window.location.origin).toString();

        if (--count === 0) {
          done();
        }
      }

      // If the settings are set to use relative paths
      if (options.useRelativePath) {
        // If the URL is relative and the pathReplace option is set
        if (node.url.startsWith('/') && options.pathReplace) {
          node.url = node.url.replace(
            (node.url as string).split('/').slice(0, -1).join('/') + '/', // Replace path before the filename
            options.pathReplace
          );
        }

        if (--count === 0) {
          done();
        }
      }

      // If the settings are set to embed images
      if (options.embeddedMedia) {
        const url = node.url.startsWith('http')
          ? node.url
          : new URL(node.url, window.location.origin).toString();
        fetch(url)
          .then((res) => res.blob())
          .then((blob) => {
            const reader = new FileReader();
            reader.addEventListener('load', (e) => {
              node.url = e.target?.result?.toString() || '';
              if (--count === 0) {
                done();
              }
            });
            reader.readAsDataURL(blob);
          });
      }
    });
  };
}
