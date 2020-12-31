const higherBelt = (belt, isAdult) => {
  if (isAdult === true) {
    switch (belt) {
      case 'biały':
        return 'niebieski';
      case 'niebieski':
        return 'purpurowy';
      case 'purpurowy':
        return 'brązowy';
      case 'brązowy':
        return 'czarny';
      default:
        return null;
    }
  } else {
    switch (belt) {
      case 'biały':
        return 'żółty';
      case 'żółty':
        return 'pomarańczowy';
      case 'pomarańczowy':
        return 'zielony';
      case 'zielony':
        return 'niebieski';
    }
  }
};

const lowerBelt = (belt, isAdult) => {
  if (isAdult) {
    switch (belt) {
      case 'czarny':
        return 'brązowy';
      case 'brązowy':
        return 'purpurowy';
      case 'purpurowy':
        return 'niebieski';
      case 'niebieski':
        return 'biały';
      default:
        return null;
    }
  } else {
    switch (belt) {
      case 'zielony':
        return 'pomarańczowy';
      case 'pomarańczowy':
        return 'żółty';
      case 'żółty':
        return 'biały';
      default:
        return null;
    }
  }
};

module.exports = higherBelt;
module.exports = lowerBelt;
