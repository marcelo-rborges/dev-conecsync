export function fixBuffStr(val: any): any {
    return typeof val === 'object'
      ? String.fromCharCode.apply(null, new Uint16Array(val))
      : val;
  }