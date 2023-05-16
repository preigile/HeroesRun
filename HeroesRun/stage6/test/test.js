import path from 'path';

const pagePath = path.join(import.meta.url, '../../src/index.html');
import {StageTest, correct, wrong} from 'hs-test-web';

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

class Test extends StageTest {
    page = this.getPage(pagePath);

    tests = [
        this.page.execute(async () => {
            const distanceImages = document.querySelectorAll('.distance img');
            let saturateImages = 0;

            distanceImages.forEach((image) => {
                const computedStyle = getComputedStyle(image);
                if (computedStyle.filter === 'saturate(1)') {
                    saturateImages++;
                }
            });

            return saturateImages === 5 ?
              correct() :
              wrong('Every image should have saturate filter applied by default');
        }),

        this.node.execute(async () => {
            const image = await this.page.findBySelector('.distance img');
            await image.hover();
            sleep(300);
            const hoverImage = await this.page.findBySelector('.distance img:hover');
            const styles = await hoverImage.getComputedStyles();

            return styles.filter === 'saturate(2)' ?
              correct() :
              wrong('Every image should be super-saturates on hover');
        }),
    ]
}

it('Test stage', async () => {
      await new Test().runTests()
  }
).timeout(30000);
