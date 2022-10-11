// Define the NuDetect client global variable
export var nds;

// Define the flag for whether the NuDetect client is ready
export var ndsReady = false;

// Define the callback queue, used after the NuDetect client is ready
export var ndsReadyCallback = [];

// Function for beginning/resuming monitoring
export const BindNewFields = () => {
  // Define the callback for resuming monitoring
  const callback = () => {
    // Bind new application fields to monitor
    nds.bindNewFields();
  };
  // Send the callback to be executed appropriately
  RequestCall(callback);
};

// Function for beginning/resuming monitoring
export function BeginBehaviouralMonitoring(session, placement) {
  if (!ndsReady) {
    onLoad(session, placement);
    return;
  }
  // Define the callback for resuming monitoring
  var callback = function () {
    // When user lands on a new placement e.g. Login, Transfer
    nds.setSessionId(session);
    // Set placement and placement page
    nds.setPlacement(placement);
    nds.setPlacement(1);
    nds.reinit();
    // Bind new application fields to monitor
    nds.bindNewFields();
  };
  // Send the callback to be executed appropriately
  RequestCall(callback);
}

// Function for stopping monitoring
export function StopBehaviouralMonitoring() {
  // Define the callback for stopping monitoring
  var callback = function () {
    // Stop monitoring
    nds.stop();
  };
  // Send the callback to be executed appropriately
  RequestCall(callback);
}

// Function to clear previously collected behavioural data
export function ClearBehaviouralData() {
  // Define the callback for clearing behavioural data
  var callback = function () {
    // Clear behavioural data
    nds.clear();
  };
  // Send the callback to be executed appropriately
  RequestCall(callback);
}

// Function used to queue and execute NDS method calls
function RequestCall(callback) {
  // Check if the NDS library is loaded and ready
  if (ndsReady) {
    // Execute the callback immediately
    callback();
  } else {
    // Queue the callback request
    ndsReadyCallback.push(callback);
  }
}

function onLoad(session, placement) {
  // Set the Client ID and Base URL
  var baseUrl = `https://api-${'us-east-1'}.nd.nudatasecurity.com/2.2/w/${'w-252422'}/sync/js`;

  (function (w, d, s, u, q, js, fjs, nds) {
    nds = w.ndsapi || (w.ndsapi = {});
    nds.config = {
      q: [],
      ready: function (cb) {
        this.q.push(cb);
      }
    };
    js = d.createElement(s);
    fjs = d.getElementsByTagName(s)[0];
    js.src = u;
    fjs.parentNode.insertBefore(js, fjs);
    js.onload = function () {
      nds.load(u);
      // If callbacks have been queued, then execute them
      for (let i = 0; i < ndsReadyCallback.length; i++) {
        ndsReadyCallback.shift()();
      }
    };
  })(window, document, 'script', baseUrl);

  nds = window.ndsapi;

  nds.config.ready(function () {
    // When user lands on a new placement e.g. Login, Transfer
    nds.setSessionId(session);
    // Set placement and placement page
    nds.setPlacement(placement);

    // Mark NDS library as ready
    ndsReady = true;
  });
}
