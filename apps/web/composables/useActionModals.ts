export function useActionModals() {
  const addItemOpen = useState("modal-add-item", () => false);
  const importOpen = useState("modal-import", () => false);
  const exportOpen = useState("modal-export", () => false);

  function openAddItem() {
    addItemOpen.value = true;
  }

  function closeAddItem() {
    addItemOpen.value = false;
  }

  function openImport() {
    importOpen.value = true;
  }

  function closeImport() {
    importOpen.value = false;
  }

  function openExport() {
    exportOpen.value = true;
  }

  function closeExport() {
    exportOpen.value = false;
  }

  return {
    addItemOpen,
    importOpen,
    exportOpen,
    openAddItem,
    closeAddItem,
    openImport,
    closeImport,
    openExport,
    closeExport,
  };
}
