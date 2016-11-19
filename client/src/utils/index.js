let utils = {};

utils.escapeRegex = function(s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

// twitch player wants a string like "1h3m44s" as the start time. this function converts a number of seconds to that format.
utils.getStartString = function(seconds) {
  let result = '';
  if (seconds >= 3600) {
    result += Math.floor(seconds / 3600) + 'h';
  }
  if (seconds % 3600 >= 60) {
    result += Math.floor((seconds % 3600) / 60) + 'm';
  }
  if (seconds % 60 > 0) {
    result += (seconds % 60) + 's';
  }
  return result;
};

utils.getTwitchEmoteImageUrl = function(emoteId) {
  return `https://static-cdn.jtvnw.net/emoticons/v1/${emoteId}/1.0`;
};

export default utils;