export default class CameraManager {
  static streams = [];

  /**
   * @param {MediaStream} stream
   */

  static addStream(stream) {
    this.streams.push(stream);
  }

  static stopAllStreams() {
    this.streams.forEach((stream) => {
      if (stream.active) {
        stream.getTracks().forEach((track) => track.stop());
      }
    });
    this.streams = [];
  }
}
