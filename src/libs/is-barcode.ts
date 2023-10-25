export function isBarcode(barcode: string): boolean {
    const BARCODE: string = `${barcode}`.replace(/[^\d]+/g, '').trim();
    return (BARCODE == barcode) && (BARCODE.length >= 8);
  }
  