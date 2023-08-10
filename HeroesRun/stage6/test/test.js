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
    // Test 1 - check iframes still exist
    this.page.execute(() => {
      const youtubeIframe = document.querySelector('.iframe-container iframe[src*="youtube"]');
      const weatherIframe = document.querySelector('.iframe-container iframe[src*="meteoblue"]');

      return youtubeIframe && weatherIframe ?
        correct() :
        wrong('The page must have iframes with content from YouTube and the weather widget. Each of these iframes must have a parent div with the class .iframe-container')
    }),

    // Test 2 - check that there are no indents
    this.page.execute(() => {
      const youtubeIframe = document.querySelector('.iframe-container iframe[src*="youtube"]');
      const weatherIframe = document.querySelector('.iframe-container iframe[src*="meteoblue"]');
      const bodyStyles = window.getComputedStyle(document.body);
      const youtubeIframeStyles = window.getComputedStyle(youtubeIframe);
      const weatherIframeStyles = window.getComputedStyle(weatherIframe);

      return bodyStyles?.margin === '0px' && bodyStyles?.padding === '0px'
      && youtubeIframeStyles?.margin === '0px' && youtubeIframeStyles?.padding === '0px'
      && weatherIframeStyles?.margin === '0px' && weatherIframeStyles?.padding === '0px'?
        correct() :
        wrong('Should remove any margin and padding from the body and iframes');
    }),

    // Test 3 - check that iframes have 100% width
    this.page.execute(() => {
      const windowWidth = `${window.innerWidth}px`;
      const iframeContainer = document.getElementsByClassName('iframe-container');
      if (!iframeContainer || iframeContainer.length !== 2) {
        return wrong('Make sure there are 2 iframe-containers on the page');
      }
      const youtubeIframeContainerStyle = window.getComputedStyle(iframeContainer[0]);
      const weatherIframeContainerStyle = window.getComputedStyle(iframeContainer[1]);

      return youtubeIframeContainerStyle.width === windowWidth && weatherIframeContainerStyle.width === windowWidth ?
        correct() :
        wrong('Width of both iframes should be set to 100% of the screen width');
    }),

    // Test 4 - check youtube iframe height
    this.page.execute(() => {
      const windowHeight = window.innerHeight;
      const youtubeIframe = document.querySelector('.iframe-container iframe[src*="youtube"]');
      const youtubeIframeHeight = Number(window.getComputedStyle(youtubeIframe).height.replace('px', ''));

      return Math.round(((youtubeIframeHeight * 100) / windowHeight)) === 80 ?
        correct() :
        wrong('Be sure the height of the YouTube iframe is 80% of screen height');
    }),

    // Test 5 - check youtube controls is hidden
    this.page.execute(async () => {
      const youtubeIframe = document.querySelector('.iframe-container iframe[src*="youtube"]');

      return youtubeIframe.src.includes('controls=0') ?
        correct() :
        wrong('Hide the controls for YouTube iframe');
    }),

    // Test 6 - check div with the class distance-container
    this.page.execute(async () => {
      const iframeContainers = document.querySelectorAll('.iframe-container');
      const distanceContainer = document.querySelector('.distance-container');

      return distanceContainer
      && iframeContainers.length === 2
      && iframeContainers[1].nextElementSibling.classList.contains('distance-container') ?
        correct() :
        wrong('Should have a div with the class distance-container below the iframes"')
    }),

    // Test 7 - check title for distances list
    this.page.execute(async () => {
      const distanceTitle = document.querySelector('.distance-container h2');
      const distanceTitleContent = distanceTitle?.textContent;

      return distanceTitleContent === 'Running Distances' ?
        correct() :
        wrong('This component should have a title "Running Distances"')
    }),

    // Test 8 - check distances content
    this.page.execute(() => {
      const distanceContainer = document.querySelector('.distance-container');
      const distances = distanceContainer?.querySelectorAll('.distance');
      let count = 0;

      for (const distance of distances) {
        const title = distance.querySelector('h2');
        const image = distance.querySelector('img');
        const text = distance.querySelector('p');
        if (title && title.textContent.length > 0
          && image && image.getAttribute('src')
          && text && text.textContent.length > 0
        ) {
          ++count
        }
      }

      return count === 5 ?
        correct() :
        wrong('Make sure you add 5 courses and each has a title, image with src, and description')
    }),

    // Test 9 - check .video-overlay block and its content
    this.page.execute(async () => {
      const videoOverlay = document.querySelector('.iframe-container iframe[src*="youtube"] + .video-overlay');
      const title = videoOverlay?.querySelector('h1');
      const button = videoOverlay?.querySelector('button');

      return videoOverlay && title && button ?
        correct() :
        wrong('Make sure you add a .video-overlay block with title and button');
    }),

    // Test 10 - check .video-overlay styles
    this.page.execute(async () => {
      const videoOverlay = document.querySelector('.iframe-container iframe[src*="youtube"] + .video-overlay');
      const styles = videoOverlay && window.getComputedStyle(videoOverlay);

      return videoOverlay && styles.position === 'absolute' && styles.backgroundColor === 'rgba(0, 0, 0, 0.5)' ?
        correct() :
        wrong('The .video-overlay block should have absolute positioning and a black background with 50% transparency');
    }),

    // Test 11 - check fonts
    this.page.execute(async () => {
      const body = document.querySelector('body');
      const fontFamily = window.getComputedStyle(body).getPropertyValue('font-family');
      const fonts = fontFamily
        && fontFamily.includes('Roboto')
        && fontFamily.includes('Helvetica Neue')
        && fontFamily.includes('Arial')
        && fontFamily.includes('sans-serif');

      return fonts ?
        correct() :
        wrong('Make sure that the body tag is set to all fonts: Roboto, Helvetica Neue, Arial, sans-serif');
    }),

    // Test 12 - check video title styles
    this.page.execute(async () => {
      const videoOverlay = document.querySelector('.iframe-container iframe[src*="youtube"] + .video-overlay');
      const videoTitle = videoOverlay?.querySelector('h1');
      const styles = videoTitle && window.getComputedStyle(videoTitle);

      return videoTitle && styles.fontSize === '73px' && styles.color === 'rgb(255, 255, 255)' && styles.top === '150px' ?
        correct() :
        wrong('The video block should have a header with a fontSize of 73px, white colour and a top indent of 150px');
    }),

    // Test 13 - check video button styles
    this.page.execute(async () => {
      const videoOverlay = document.querySelector('.iframe-container iframe[src*="youtube"] + .video-overlay');
      const videoButton = videoOverlay?.querySelector('button');
      const styles = videoButton && window.getComputedStyle(videoButton);

      return videoButton
      && videoButton.innerText === 'Join us!'
      && styles.padding === '5px 10px'
      && styles.border === '2px solid rgb(255, 255, 255)'
      && styles.color === 'rgb(255, 255, 255)'
      && styles.backgroundColor === 'rgba(0, 0, 0, 0)'
      && styles.fontSize === '24px' ?
        correct() :
        wrong('The button should have the following styles: padding 5px 10px, white border (2px), white colour, transparent background, text "Join us!" with font size 24px');
    }),

    // Test 14 - check list of distances maximum width
    this.page.execute(async () => {
      const distanceContainer = document.querySelector('.distance-container');
      const styles = window.getComputedStyle(distanceContainer);

      return distanceContainer && styles.maxWidth === '1000px'
      && styles.marginLeft === styles.marginRight ?
        correct() :
        wrong('Make sure that the list of distances has a maximum width of 1000px and is placed in the middle');
    }),

    // Test 15 - check distance list header font size
    this.page.execute(async () => {
      const distanceContainer = document.querySelector('.distance-container');
      const distanceHeader = distanceContainer?.querySelector('h2');
      const styles = window.getComputedStyle(distanceHeader);

      return distanceHeader && styles.fontSize === '32px' ?
        correct() :
        wrong('Make sure that the font size of the distance list header is 32px');
    }),

    // Test 16 - alternate the image position on every list item
    this.page.execute(async () => {
      const distancesList = document.querySelectorAll('ul li');
      let isAlternate = true;

      for (let index = 0; index < distancesList.length && isAlternate; index++) {
        const img = distancesList[index].querySelector('img');
        const styles = img && window.getComputedStyle(img);
        const isEvenItem = index % 2 === 0;
        const isImageOnLeft = styles.float === 'left';
        const isImageOnRight = styles.float === 'right';

        isAlternate = (isEvenItem && isImageOnLeft) || (!isEvenItem && isImageOnRight);
      }

      return isAlternate ?
        correct() :
        wrong('Make sure that alternate the image position on every list item');
    }),

    // Test 17 - check list item styles
    this.page.execute(async () => {
      const distancesList = document.querySelectorAll('ul li');
      let validStyles = true;

      for (let index = 0; index < distancesList.length && validStyles; index++) {
        const distance = distancesList[index];
        const styles = distance && window.getComputedStyle(distance);

        validStyles = styles.display === 'table' && styles.clear === 'both';
      }

      return validStyles ?
        correct() :
        wrong('Ensure that the list items have the properties `display: table` and `clear: both`');
    }),

    // Test 18 - check map title
    this.page.execute(async () => {
      const mapTitle = document.querySelector('.map-container h2');
      const mapTitleContent = mapTitle?.textContent;

      return mapTitleContent === 'See you at Big Ben!' ?
        correct() :
        wrong('The map should have title with text See you at Big Ben!')
    }),

    // Test 19 - check iframe with map
    this.page.execute(async () => {
      const embeddedMap = document.querySelector('.map-container iframe');

      return embeddedMap && embeddedMap.src.includes('google.com/maps/embed') ?
        correct() :
        wrong('The last iframe should have an embedded map')
    }),

    // Test 20 - check .distance-image
    this.page.execute(async () => {
      const distanceImages = document.querySelectorAll('.distance-image');

      return distanceImages && distanceImages.length === 5 ?
        correct() :
        wrong('Should have 5 images with the class distance-image')
    }),

    // Test 21 - check saturate filter applied by default
    this.page.execute(async () => {
      const distanceImages = document.querySelectorAll('.distance img');
      let saturateImages = 0;

      distanceImages.forEach((image) => {
        const computedStyle = getComputedStyle(image);
        if (computedStyle && computedStyle.filter === 'saturate(1)') {
          saturateImages++;
        }
      });

      return saturateImages === 5 ?
        correct() :
        wrong('Every image should have saturate filter applied by default');
    }),

    // Test 22 - check super-saturates on hover
    this.node.execute(async () => {
      const image = await this.page.findBySelector('.distance img');
      await image.hover();
      sleep(300);
      const hoverImage = await this.page.findBySelector('.distance img:hover');
      const styles = await hoverImage?.getComputedStyles();

      return styles?.filter === 'saturate(2)' ?
        correct() :
        wrong('Every image should be super-saturates on hover');
    }),
  ]
}

it('Test stage', async () => {
    await new Test().runTests()
  }
).timeout(30000);
