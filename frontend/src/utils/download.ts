export const downloadByUrl = async (url: string, fileName: string) => {
  const response = await fetch(url);
  const fileContent = await response.blob();
  if (!response.ok) {
    throw new Error('Failed to download file');
  }
  const urlObject = window.URL.createObjectURL(
    new Blob([fileContent], { type: 'text/csv' })
  );
  const link = document.createElement('a');
  link.href = urlObject;
  link.target = '_blank';
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
};
