/* global data, writeData */
interface FormElements extends HTMLFormControlsCollection {
  title: HTMLInputElement;
  photoUrl: HTMLInputElement;
  notes: HTMLTextAreaElement;
}

interface Entry {
  entryId: number;
  title: string;
  photoUrl: string;
  notes: string;
}

const entryImagePlaceholder = 'images/placeholder-image-square.jpg';
const $photoUrlInput = document.querySelector('#photo-url') as HTMLInputElement;
const $formImage = document.querySelector('#entry-image');
const $entryForm = document.querySelector('#entry-form') as HTMLFormElement;
const $entryList = document.querySelector('.entry-list');
const $noEntriesText = document.querySelector('.no-entries-text');
const $entriesView = document.querySelector('.entries-wrapper');
const $entryFormView = document.querySelector('.entry-form-wrapper');
const $navItem = document.querySelector('.nav-item');
const $newEntryBtn = document.querySelector('.new-entry-button');
const $entryTitle = document.getElementById('title') as HTMLInputElement;
const $notes = document.getElementById('notes') as HTMLTextAreaElement;
const $deleteBtn = document.querySelector('.delete-button');
const $modal = document.querySelector('dialog');
const $cancelModal = document.querySelector('.cancel-modal');
const $confirmModal = document.querySelector('.confirm-modal');
const $newEntryHeader = document.querySelector(
  '.new-entry-header'
) as HTMLHeadingElement;

if (!$photoUrlInput) throw new Error('$photoUrlInput is null');
$photoUrlInput.addEventListener('input', (event: Event) => {
  if (!$formImage) {
    throw new Error('$formImage is null');
  }

  const $eventTarget = event.target as HTMLInputElement;
  $formImage.setAttribute('src', $eventTarget.value);
});

if (!$entryForm) throw new Error('$entryForm is null');
$entryForm.addEventListener('submit', (event: Event) => {
  event.preventDefault();

  if (!$formImage || !$entryList) {
    throw new Error('$formImage or $entryList is null');
  }

  const $eventTarget = event.target as HTMLFormElement;
  const $formElements = $eventTarget.elements as FormElements;

  const entry: Entry = {
    entryId: data.nextEntryId,
    title: $formElements.title.value,
    photoUrl: $formElements.photoUrl.value,
    notes: $formElements.notes.value,
  };

  if (data.editing !== null) {
    entry.entryId = data.editing.entryId;
    updateEntries(entry);
    const $liToReplace = findLi(data.editing.entryId);
    $liToReplace?.replaceWith(renderEntry(entry));
    data.editing = null;
  } else {
    data.nextEntryId++;
    data.entries.unshift(entry);
    $entryList.prepend(renderEntry(entry));
  }
  writeData();
  resetForm();
  toggleNoEntries();
  viewSwap('entries');
});

document.addEventListener('DOMContentLoaded', () => {
  if (!$entryList) {
    throw new Error('$entryList is null');
  }

  for (let i = 0; i < data.entries.length; i++) {
    const entry = data.entries[i];
    $entryList.append(renderEntry(entry));
  }
  const currentView = data.view;
  viewSwap(currentView);
  toggleNoEntries();
});

if (!$navItem) throw new Error('$navItem is null');
$navItem.addEventListener('click', (event: Event) => {
  const $eventTarget = event.target as HTMLElement;
  const viewName = $eventTarget.dataset.view;
  if (viewName === 'entries' || viewName === 'entry-form') {
    viewSwap(viewName);
  }
});

if (!$newEntryBtn) throw new Error('$newEntryBtn is null');
$newEntryBtn.addEventListener('click', (event: Event) => {
  const $eventTarget = event.target as HTMLElement;
  const viewName = $eventTarget.dataset.view;
  if (viewName === 'entries' || viewName === 'entry-form') {
    resetForm();
    viewSwap(viewName);
  }
});

if (!$entryList) throw new Error('$entryList is null');
$entryList.addEventListener('click', (event: Event) => {
  const $eventTarget = event.target as HTMLElement;

  if ($eventTarget.tagName !== 'I') {
    return;
  }

  const $closestLi = $eventTarget.closest('[data-entry-id]') as HTMLLIElement;
  if (!$closestLi) {
    throw new Error('$closestLi is null');
  }

  const entryId = Number($closestLi.dataset.entryId);
  data.editing = findEntryObject(entryId);
  if (data.editing) {
    populateForm(data.editing);
    viewSwap('entry-form');
  }
});

if (!$deleteBtn) throw new Error('$deleteBtn is null');
$deleteBtn.addEventListener('click', () => {
  if (!$modal) {
    throw new Error('$modal is null');
  }

  $modal.showModal();
});

if (!$cancelModal) throw new Error('$cancelModal is null');
$cancelModal.addEventListener('click', () => {
  if (!$modal) {
    throw new Error('$modal is null');
  }
  $modal.close();
});

if (!$confirmModal) throw new Error('$confirmModal is null');
$confirmModal.addEventListener('click', () => {
  if (!data.editing) {
    return;
  }

  if (!$modal) {
    throw new Error('$modal is null');
  }

  removeEntryObject(data.editing.entryId);
  findLi(data.editing.entryId)?.remove();
  $modal.close();
  data.editing = null;
  writeData();
  toggleNoEntries();
  resetForm();
  viewSwap('entries');
});

function findEntryObject(entryId: number): Entry | null {
  for (let i = 0; i < data.entries.length; i++) {
    if (data.entries[i].entryId === entryId) {
      return data.entries[i];
    }
  }
  return null;
}

function removeEntryObject(entryId: number): void {
  const updatedArray = data.entries.filter(
    (entry) => entry.entryId !== entryId
  );
  data.entries = updatedArray;
}

function populateForm(entry: Entry): void {
  if (
    !$formImage ||
    !$deleteBtn ||
    !$entryTitle ||
    !$notes ||
    !$newEntryHeader
  ) {
    throw new Error(
      '$formImage, $deleteBtn, $entryTitle, $notes, or $newEntryHeader is null'
    );
  }
  $formImage.setAttribute('src', entry.photoUrl);
  $entryTitle.value = entry.title;
  $photoUrlInput.value = entry.photoUrl;
  $notes.value = entry.notes;
  $deleteBtn.classList.remove('hide');
  $newEntryHeader.textContent = 'Edit Entry';
}

function updateEntries(formEntry: Entry): void {
  const newEntries = data.entries.map((entry) => {
    if (entry.entryId === formEntry.entryId) {
      return formEntry;
    } else {
      return entry;
    }
  });
  data.entries = newEntries;
}

function findLi(entryId: number): HTMLLIElement | void {
  const $lis = document.querySelectorAll('li');
  for (const li of $lis) {
    if (Number(li.getAttribute('data-entry-id')) === entryId) {
      return li;
    }
  }
}

function resetForm(): void {
  if (!$formImage) {
    throw new Error('$formImage is null');
  }

  $formImage.setAttribute('src', entryImagePlaceholder);
  $deleteBtn?.classList.add('hide');
  $newEntryHeader.textContent = 'New Entry';
  $entryForm.reset();
}

function toggleNoEntries(): void {
  if (!$noEntriesText) {
    throw new Error('$noEntriesText is null');
  }

  if (data.entries.length) {
    $noEntriesText.classList.add('hidden');
  } else {
    $noEntriesText.classList.remove('hidden');
  }
}

function renderEntry(entry: Entry): HTMLLIElement {
  const $entry = document.createElement('li');
  $entry.setAttribute('data-entry-id', entry.entryId.toString());

  const $entryRow = document.createElement('div');
  $entryRow.className = 'row';

  const $leftColumn = document.createElement('div');
  $leftColumn.className = 'column-half';

  const $listImageWrapper = document.createElement('div');
  $listImageWrapper.className = 'list-image-wrapper';

  const $entryImg = document.createElement('img');
  $entryImg.setAttribute('src', entry.photoUrl);

  const $rightColumn = document.createElement('div');
  $rightColumn.className = 'column-half';

  const $entryTitle = document.createElement('h2');
  $entryTitle.textContent = entry.title;

  const $editIcon = document.createElement('i');
  $editIcon.className = 'edit fa-solid fa-pencil';

  const $entryNotes = document.createElement('p');
  $entryNotes.textContent = entry.notes;

  $entry.append($entryRow);
  $entryRow.append($leftColumn, $rightColumn);
  $leftColumn.append($listImageWrapper);
  $listImageWrapper.append($entryImg);
  $rightColumn.append($entryTitle, $entryNotes);
  $entryTitle.append($editIcon);

  return $entry;
}

function viewSwap(viewName: 'entries' | 'entry-form'): void {
  if (!$entryFormView || !$entriesView) {
    throw new Error('$entryFormView or $entriesView is null');
  }

  if (viewName === 'entries') {
    $entriesView.classList.remove('hidden');
    $entryFormView.classList.add('hidden');
  } else if (viewName === 'entry-form') {
    $entryFormView.classList.remove('hidden');
    $entriesView.classList.add('hidden');
  }
  data.view = viewName;
}
