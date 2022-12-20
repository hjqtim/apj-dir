export default function downloadFile(data, fileName) {
  const blob = new Blob([data]);
  if (window.navigator.msSaveBlob) {
    window.navigator.msSaveBlob(blob, fileName);
  } else {
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = fileName;
    a.href = objectUrl;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
