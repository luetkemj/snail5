# Snail 5

[Play](https://luetkemj.github.io/snail5/)

The fifth iteration of snail. A roguelike built to learn how to build roguelikes.

This iteration will features a (hopefully) improved [ECS](http://vasir.net/blog/game-development/how-to-build-entity-component-system-in-javascript) architecture than snail4.

[More on the previous iterations.](https://luetkemj.github.io/191117/yala)

## Tests

This project uses Jest for testing. To run tests rename file `.Xbabelrc` to `.babelrc` and run `npm run test` or `npm run test:watch`.

**Note:** Parcel2 in still in alpha and seems to have trouble building with additional babelrc files. Jest requires a babelrc to run the tests... So this is where we are for now. Don't forget to re-rename `.babelrc` to ~`.Xbabelrc` before deploy or the internet will break.

```
                          . O
                      `
          @___    `
          |____'
           \
 punt.     |

```
