const cameraEl = document.getElementById("camera");
const canvasEl = document.getElementById("canvas");
const tracker = new clm.tracker();

if (document.readyState != "loading") ready();
else document.addEventListener("DOMContentLoaded", ready);

cameraEl.addEventListener("play", () => {
	// Resize everything to match the actual
	// video frame size
	canvasEl.width = cameraEl.videoWidth;
	canvasEl.height = cameraEl.videoWidth;
	cameraEl.width = cameraEl.videoWidth;
	cameraEl.height = cameraEl.videoHeight;

	tracker.init();
	tracker.start(cameraEl);
	window.requestAnimationFrame(renderFrame);
});

// Calculate angle between two coordinates, given as arrays
function calcAngle(a, b) {
	return Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
}

// Calculate distance between two coordinates, given as arrays
function calcDistance(a, b) {
	let x = b[0] - a[0];
	let y = b[1] - a[1];
	x = x * x;
	y = y * y;
	return Math.sqrt(x + y);
}

function renderFrame() {
	var c = canvasEl.getContext("2d");
	var p = tracker.getCurrentPosition();
	var eventData = {
		tracking: false,
		rotation: NaN,
		size: NaN,
		horiz: NaN,
		vert: NaN
	};
	if (p) {
		// Tracker seems to think it's tracking
		eventData.tracking = true;

		// Use point 0 and 14, which correspond roughly to the sides of the face
		// See diagram on https://github.com/auduno/clmtrackr
		eventData.rotation = parseInt(calcAngle(p[0], p[14]));

		// Use points 33 and 7 which correspond roughly to the top and bottom of face
		const vDistance = calcDistance(p[33], p[7]);
		// Get a ratio of vertical distance and canvas height
		eventData.vert = vDistance / canvasEl.height;

		// Points that correspond to sides
		const hDistance = calcDistance(p[1], p[13]);
		// Get a ratio of horizontal distance and canvas width
		eventData.horiz = hDistance / canvasEl.width;

		// Compute an overall relative size based on average of both
		eventData.size = (eventData.vert + eventData.horiz) / 2;

		// Optional visual feedback of tracker
		if (!canvasEl.classList.contains("hidden")) {
			c.drawImage(cameraEl, 0, 0);
			tracker.draw(canvasEl);
		}
	}

	// Update the red thing
	const thingEl = document.getElementById("thing");
	thingEl.style.rotate = eventData.rotation * -1 + "deg";
	if (eventData.tracking) {
		thingEl.classList.remove("inactive");
	} else {
		thingEl.classList.add("inactive");
	}
	thingEl.style.transform =
		"scale(" + eventData.horiz * 10 + "," + 10 * eventData.vert + ")";

	// Update UI labels (for debugging)
	document.getElementById("rotation").innerText = eventData.rotation;
	document.getElementById("size").innerText =
		Math.floor(eventData.size * 100) + "%";
	document.getElementById("tracking").innerText = eventData.tracking;

	// Repeat!
	window.requestAnimationFrame(renderFrame);
}

// ------------------------

// Reports outcome of trying to get the camera ready
function cameraReady(err) {
	if (err) {
		console.log("Camera not ready: " + err);
		return;
	}
}

// Tries to get the camera ready, and begins streaming video to the cameraEl element.
function ready() {
	const constraints = {
		audio: false,
		video: { width: 640, height: 480 }
	};
	navigator.mediaDevices
		.getUserMedia(constraints)
		.then(function(stream) {
			cameraEl.srcObject = stream;
			cameraReady();
		})
		.catch(function(err) {
			cameraReady(err); // Report error
		});

	document.body.addEventListener("click", e => {
		document.getElementById("canvas").classList.toggle("hidden");
	});
}
