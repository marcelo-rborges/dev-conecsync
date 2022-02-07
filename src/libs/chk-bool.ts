export function chkBool(val: any): boolean | null {
  switch (typeof val) {
    case 'boolean':
      return !!val;
      break;

    case 'number':
      return val > 0;
      break;

    case 'string':
      return ['S', 'T', '1'].includes(val.trim().toUpperCase());
      break;

    default:
      return null;
      break;
  } // switch
}
