

/**
 * Serial helper class. 
 * 
 * Call open() to connect, print() or println() to write to the serial port.
 * Assign a function to 'ondata' to receive data when it arrives. It assumes
 * data is separated by new line characters.
 *
 * Set 'debug' to false to disable non-error logging
 * 
 * @author Clint Heyer, 2021
 * @class Serial
 */
class Serial {
  state = STATES.IDLE;
  reconnect = true;
  port = null;
  baudRate = 0;
  debug = true;
  ondata = null;
  onjson = null;

  /**
   * Creates an instance of Serial.
   * @param {number} [baudRate=19200]
   * @memberof Serial
   */
  constructor(baudRate = 19200) {
    this.baudRate = baudRate;
    if (typeof navigator.serial === 'undefined') throw 'Serial API not supported or enabled? Make sure you have enabled experimental flags';

    navigator.serial.addEventListener('connect', (e) => {
      // Reconnect?
      if (this.state == STATES.CLOSED && this.reconnect) {
        this.open(e.port);
      }
    })

    navigator.serial.addEventListener('disconnect', (e) => {
      this.logError('Disconnected');
    });
  }

  /**
   * Write data to serial
   *
   * Throws an error if port is not open
   * 
   * @param {string} data Data to send
   * @memberof Serial
   */
  print(data) {
    if (!this.isOpen()) throw new Error('Not in OPEN state');
    // This stub gets assigned in open()
  }

  /**
   * Write data to a serial putting a new line after
   *
   * Throws an error if port is not open
   * 
   * @param {string} data Data to send
   * @memberof Serial
   */
  println(data) {
    this.print(data + '\n');
  }
  /**
   * Writes an object
   *
   * @param {*} data
   * @memberof Serial
   */
  printObject(data) {
    this.print(JSON.stringify(data), '\n');
  }

  setState(state) {
    if (state == this.state) return;
    let stateStr = (s) => {
      switch (s) {
        case STATES.OPENING:
          return 'Opening';
        case STATES.IDLE:
          return 'Idle';
        case STATES.OPEN:
          return 'Open';
        case STATES.CLOSED:
          return 'Closed';
        case STATES.CLOSING:
          return 'Closing';
        default:
          return '?'
      }
    };
    this.log(stateStr(this.state) + '->' + stateStr(state));
    this.state = state;
  }

  log(msg) {
    if (!this.debug) return;
    console.log('Serial', msg);
  }

  logError(msg) {
    console.error('Serial', msg);
  }

  async getPort() {
    let port = null;
    const ports = await navigator.serial.getPorts();
    const portInfo = ports.map(p => p.getInfo());
    if (ports.length == 1) {
      this.log('Using previous port. USB pid: ' + portInfo[0].usbProductId + ' vid: ' + portInfo[0].usbVendorId);
      port = ports[0]
    } else {
      port = await navigator.serial.requestPort();
    }
    return port;
  }

  /**
   * Returns true if port is open
   *
   * @returns
   * @memberof Serial
   */
  isOpen() {
    return this.state == STATES.OPEN;
  }

  /**
   * Opens serial connection. Be sure to call this from a user interaction.
   *
   * Throws an error if port is opening or already open
   * 
   * @memberof Serial
   */
  async open(port = null) {
    if (this.state == STATES.OPENING) throw new Error('Connecting in progress');
    if (this.state == STATES.OPEN) throw new Error('Already connected');
    this.reconnect = true;
    this.setState(STATES.OPENING);

    this.port = port || await this.getPort();
    await this.port.open({ baudRate: this.baudRate });

    this.setState(STATES.OPEN);

    while (this.port.readable && this.state == STATES.OPEN) {
      const decoder = new TextDecoderStream();
      const inputDone = this.port.readable.pipeTo(decoder.writable);
      const reader = decoder.readable.pipeThrough(
        new TransformStream(
          new LineBreakTransformer())).getReader();

      const encoder = new TextEncoderStream();
      const writeDone = encoder.readable.pipeTo(this.port.writable);
      const writer = encoder.writable.getWriter();
      this.print = async (d) => {
        if (!this.isOpen()) throw new Error('Not in OPEN state');
        return writer.write(d);
      }

      this.close = async () => {
        this.reconnect = false;
        this.setState(STATES.CLOSING);
        reader.cancel();
        await inputDone.catch(() => { /* Ignore error */ });
        writer.close();
        await writeDone.catch(() => { /* Ignore error */ });
        await this.port.close();
      }

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            reader.releaseLock();
            break;
          }
          if (value && this.ondata) {
            setTimeout(() => { this.ondata(value) }, 1);
          }
          if (value && this.onjson) {
            try {
              let o = JSON.parse(value);
              setTimeout(() => { this.onjson(o); }, 1);
            } catch (e) {
              this.logError(e);
              //this.logError('Data received was: ' + value);
            }
          }
        }
      } catch (error) {
        this.logError(error);
      }
      this.setState(STATES.CLOSED);
    }
  }

  /**
   * Close port
   *
   * @memberof Serial
   */
  close() {
    // This function gets assigned via open()
  }

}


const STATES = {
  IDLE: 0,
  OPENING: 1,
  OPEN: 2,
  CLOSED: 3,
  CLOSING: 4,
}

class LineBreakTransformer {
  constructor() {
    // A container for holding stream data until a new line.
    this.chunks = "";
  }

  transform(chunk, controller) {
    // Append new chunks to existing chunks.
    this.chunks += chunk;
    // For each line breaks in chunks, send the parsed lines out.
    const lines = this.chunks.split("\r\n");
    this.chunks = lines.pop();
    lines.forEach((line) => controller.enqueue(line));
  }

  flush(controller) {
    // When the stream is closed, flush any remaining chunks out.
    controller.enqueue(this.chunks);
  }
}

export { Serial }
