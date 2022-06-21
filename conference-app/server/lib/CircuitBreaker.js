const axios = require("axios");

/**
 * """CIRCUIT BREAKER"""
 *
 *   CLOSED --- OPEN
 *      \     /
 *       HALF
 *
 * """"""""""""""""""""
 */

/**
 * This is used to stop the service request if
 * it reaches the threshold for failing. The circuit
 * will go to the 'OPEN' state to cool down it for some time.
 * Then it will go to 'HALF' state to re-request the endpoint.
 * if it succeed, it will go to the 'CLOSED' state, else it will go
 * back to the OPEN state to cool down and wait till the
 * cool down time period.
 */
class CircuitBreaker {
  constructor() {
    this.state = {};
    this.failureThreshold = 5;
    this.cooldownPeriod = 10;
    this.requestTimeout = 1;
  }

  async callService(requestOptions) {
    const endpoint = `${requestOptions.method}:${requestOptions.url}`;

    if (!this.canRequest(endpoint)) return false;

    requestOptions.timeout = this.requestTimeout * 1000;

    try {
      const response = await axios(requestOptions);
      this.onSuccess(endpoint);
      return response.data;
    } catch (error) {
      this.onFailure(endpoint);
      return false;
    }
  }

  // CLOSED State
  onSuccess(endpoint) {
    this.initState(endpoint);
  }

  // OPEN state for cooling down
  onFailure(endpoint) {
    const state = this.state[endpoint];
    state.failures += 1;
    if (state.failures > this.failureThreshold) {
      state.circuit = "OPEN";
      state.nextTry = new Date() / 1000 + this.cooldownPeriod;
      console.log(`ALERT! Circuit for ${endpoint} is in state 'OPEN'`);
    }
  }

  // Check if the request is possible (HALF state)
  canRequest(endpoint) {
    if (!this.state[endpoint]) this.initState(endpoint);
    const state = this.state[endpoint];
    if (state.circuit === "CLOSED") return true;
    const now = new Date() / 1000;
    if (state.nextTry <= now) {
      state.circuit = "HALF";
      return true;
    }
    return false;
  }

  initState(endpoint) {
    this.state[endpoint] = {
      failures: 0,
      cooldownPeriod: this.cooldownPeriod,
      circuit: "CLOSED",
      nextTry: 0,
    };
  }
}

module.exports = CircuitBreaker;
