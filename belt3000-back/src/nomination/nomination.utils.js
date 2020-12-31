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

module.exports = higherBelt;
