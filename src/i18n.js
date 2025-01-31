
import I18n from 'react-native-i18n';
I18n.fallbacks = true;

I18n.translations = {
  "en" : require('./translations/english.json'),
  "ar" : require('./translations/arabic.json'),
};

export default I18n;