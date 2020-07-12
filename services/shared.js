import { solveStateTextMap } from '~/services/constants.js'
import moment from 'moment'

export default {
  handleError: function (err, root = null) {
    if (root) {
      if (err.response && err.response.data.info) {
        root.$notifier.showSnackbar({
          message: err.response.data.info,
          variant: 'error',
        })
      } else {
        //sanitize error message
        root.$notifier.showSnackbar({
          message: this.sanitizeErrorMessage(err.message),
          variant: 'error',
        })
      }
    }
    console.log(err)
  },

  sanitizeErrorMessage(errMessage) {
    return errMessage.replace(/^GraphQL error: /, '')
  },

  copyToClipboard(that, content) {
    that.$copyText(content)
    that.$notifier.showSnackbar({
      message: 'Copied to Clipboard',
      variant: 'success',
    })
  },

  generateError: function (message, errno = null) {
    var err = new Error(message)
    if (errno) {
      err.errno = errno
    }
    return err
  },

  playSound(sound) {
    if (sound) {
      var audio = new Audio(sound)
      audio.play()
    }
  },

  generateSolveString(solve, currentRound = false) {
    if (!solve) return ''
    return solve.is_dnf
      ? 'DNF'
      : solve.state == 'FINISHED'
      ? this.generateTimeString(solve.result) + (solve.penalties ? '+' : '')
      : currentRound
      ? solveStateTextMap[solve.state]
      : ''
  },

  generateAccumulatedResultString(accumulated) {
    if (!accumulated) return 'N/A'

    switch (accumulated.contextualAccumulator.type_id) {
      case '1':
        return accumulated.is_dnf
          ? 'DNF'
          : this.generateTimeString(accumulated.result.toFixed())
      case '2':
      case '3':
        return accumulated.result
      default:
        return 'N/A'
    }
  },

  generateAverageString(solves, numSolves) {
    if (solves.length < numSolves + 1) {
      return 'N/A'
    }

    let totalMs = 0,
      numDnf = 0,
      maxSolve,
      minSolve

    for (let i = 1; i < numSolves + 1; i++) {
      if (!solves[i] || solves[i].is_dnf) {
        if (++numDnf >= 2) {
          return 'DNF'
        }
      }

      if (solves[i].result > (maxSolve ? maxSolve.result : -Infinity)) {
        maxSolve = solves[i]
      }

      if (solves[i].result < (minSolve ? minSolve.result : Infinity)) {
        minSolve = solves[i]
      }

      totalMs += solves[i].result
    }

    //remove the maxSolve and minSolve
    totalMs -= maxSolve.result + minSolve.result

    return this.generateTimeString((totalMs / (numSolves - 2)).toFixed())
  },

  generateTimeString(ms) {
    let wholeMinutes = Math.floor(ms / (1000 * 60))
    ms -= wholeMinutes * 1000 * 60
    let wholeSeconds = Math.floor(ms / 1000)
    ms -= wholeSeconds * 1000

    let str = (ms + '').padStart(3, '0')

    if (wholeSeconds < 10 && wholeMinutes) {
      str =
        wholeMinutes + ':' + (wholeSeconds + '').padStart(2, '0') + '.' + str
    } else {
      str = (wholeMinutes ? wholeMinutes + ':' : '') + wholeSeconds + '.' + str
    }

    return str
  },

  generateMomentString(datetime) {
    return moment.utc(datetime).fromNow()
  },

  goToWcaProfile(wca_id) {
    if (process.client) {
      window.open(
        'https://www.worldcubeassociation.org/persons/' + wca_id,
        '_blank',
      )
    }
  },

  goToLink(url) {
    if (process.client) {
      window.open(url, '_blank')
    }
  },
}
