export default function Captcha({ captcha }: { captcha: string }) {
  return (
    <iframe
      srcDoc={`
        <style>
          #nucaptcha-media {
            margin: 20px auto!important;
            width: 80%!important;
          }

          #directions-verbose-label, #nucaptcha-answer {
            max-width: 45%;
            display: inline-block;
          }

          div.nucaptcha_container_actions {
            padding-top: 10px;
          }

          /* Define our button styles */
          a.nucaptcha_action {
            display: inline-block;
            width: 30px;
            height: 30px;
            background-color: white;
            border: 2px solid gray;
            border-radius: 4px;
            overflow: hidden;
            text-indent: -20000px;
            text-decoration: none;
            text-transform: none;
            background-repeat: no-repeat;
            background-size: 70%;
            background-position: center;
          }

          a.nucaptcha_action-get-a-new-challenge {
            background-image: url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 20"%3E%3Cpath fill="currentColor" d="M14.66 15.66A8 8 0 1 1 17 10h-2a6 6 0 1 0-1.76 4.24l1.42 1.42zM12 10h8l-4 4l-4-4z"%2F%3E%3C%2Fsvg%3E');
          }

          a.nucaptcha_action-toggle-audio {
            background-image: url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"%3E%3Cpath fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2 14.959V9.04C2 8.466 2.448 8 3 8h3.586a.98.98 0 0 0 .707-.305l3-3.388c.63-.656 1.707-.191 1.707.736v13.914c0 .934-1.09 1.395-1.716.726l-2.99-3.369A.98.98 0 0 0 6.578 16H3c-.552 0-1-.466-1-1.041ZM16 8.5c1.333 1.778 1.333 5.222 0 7M19 5c3.988 3.808 4.012 10.217 0 14"%2F%3E%3C%2Fsvg%3E');
          }

          a.nucaptcha_action-toggle-video {
            display: none;
            background-image: url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"%3E%3Cg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"%3E%3Cpath d="M2 6a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V6Z"%2F%3E%3Ccircle cx="8.5" cy="8.5" r="2.5"%2F%3E%3Cpath d="M14.526 12.621L6 22h12.133A3.867 3.867 0 0 0 22 18.133V18c0-.466-.175-.645-.49-.99l-4.03-4.395a2 2 0 0 0-2.954.006Z"%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E');
          }
        </style>
        ${captcha}
        <script type="text/javascript">
          function onClickToggle(type) {
            var nci = nucaptcha.getInterface(1);
            if(type === 'PLAYERMODE_AUDIO') {
              document.getElementById('toggle-audio').style.display = 'none';
              document.getElementById('toggle-video').style.display = 'inline-block';
            }
            if(type === 'PLAYERMODE_VIDEO') {
              document.getElementById('toggle-audio').style.display = 'inline-block';
              document.getElementById('toggle-video').style.display = 'none';
            }
            /**
            * Put the widget into PLAYERMODE_VIDEO or PLAYERMODE_AUDIO 
            * @param playerMode string Specify PLAYERMODE_VIDEO or
            * PLAYERMODE_AUDIO 
            */
            nci.cmdSetPlayerMode(type);
            return true;
          }
          function onClickGetANewChallenge() {
            var nci = nucaptcha.getInterface(1);
            nci.cmdGetANewChallenge();
            return true;
          }
        </script>
        <div class="nucaptcha_container_actions">
          <a href="javascript:onClickGetANewChallenge()" id="get-a-new-challenge" class="nucaptcha_action nucaptcha_action-get-a-new-challenge" title="Get A New Challenge">
            Get A New Challenge
          </a>
          <a href="javascript:onClickToggle('PLAYERMODE_AUDIO')" id="toggle-audio" class="nucaptcha_action nucaptcha_action-toggle-audio" title="Toggle Audio">
            Toggle Audio
          </a>
          <a href="javascript:onClickToggle('PLAYERMODE_VIDEO')" id="toggle-video" class="nucaptcha_action nucaptcha_action-toggle-video" title="Toggle Video">
            Toggle Text
          </a>
        </div>
      `}
      title="This is a NuCaptcha"
      style={{ border: 'unset', height: 225 }}
    >
      <p>Your browser does not support iframes.</p>
    </iframe>
  );
}

export function getCaptchaValues() {
  const iframe = document.querySelector(`iframe`);
  if (iframe) {
    const window = iframe.contentWindow;

    if (window) {
      const elementToken = window.document.getElementById('nucaptcha-token');
      const elementAnswer = window.document.getElementById('nucaptcha-answer');

      if (elementToken && elementAnswer) {
        const token = elementToken.getAttribute('value') || '';
        const answer = (elementAnswer as any).value || '';

        return { token, answer };
      }
    }
  }
  return null;
}
