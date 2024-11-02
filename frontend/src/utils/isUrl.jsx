export default function isUrl(string){
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };