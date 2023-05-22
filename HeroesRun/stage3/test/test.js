import path from 'path';

const pagePath = path.join(import.meta.url, '../../src/index.html');
import {StageTest, correct, wrong} from 'hs-test-web';

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
        return wrong('Make sure there are still 2 iframe-containers on the page');
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

      return !youtubeIframe.src.includes('controls=1') ?
        correct() :
        wrong('Hide the controls for YouTube iframe');
    }),

    // Test 6 - check div with the class distance-container
    this.page.execute(async () => {
      const distanceContainer = document.querySelector('.distance-container');

      return distanceContainer ?
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

    // Test 8 - check distances list size
    this.page.execute(() => {
      const distanceContainer = document.querySelector('.distance-container');
      const distances = distanceContainer.querySelectorAll('.distance');

      return distances.length === 5 ?
        correct() :
        wrong(`Please add all 5 distance`)
    }),

    // Test 9 - check distances content
    this.page.execute(() => {
      const distanceContainer = document.querySelector('.distance-container');
      const distances = distanceContainer?.querySelectorAll('.distance');
      let count = 0;

      for (const distance of distances) {
        if (distance.querySelector('h2').textContent.length > 0
          && distance.querySelector('img').getAttribute('src')
          && distance.querySelector('p').textContent.length > 0
        ) {
          ++count
        }
      }

      return count === 5 ?
        correct() :
        wrong('Be sure each distance have a title, image, and description')
    }),
  ]
}

it('Test stage', async () => {
    await new Test().runTests()
  }
).timeout(30000);
