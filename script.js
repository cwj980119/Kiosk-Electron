const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
const detectorConfig = {
  runtime: 'tfjs',
};
detector = await faceLandmarksDetection.createDetector(model, detectorConfig);

const estimationConfig = {flipHorizontal: false};
const faces = await detector.estimateFaces(image, estimationConfig);