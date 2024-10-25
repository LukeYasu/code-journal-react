import { useEffect, useState, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  addEntry,
  Entry,
  readEntry,
  UnsavedEntry,
  updateEntry,
  removeEntry,
} from './data';
import { Modal } from './Modal';

export function EntryForm() {
  const { entryId } = useParams();
  const [entry, setEntry] = useState<Entry | UnsavedEntry>();
  const [error, setError] = useState<Error | unknown>();
  const [loading, setLoading] = useState(true);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadEntry(entryId: number) {
      try {
        const entry = await readEntry(entryId);

        if (!entry) {
          throw new Error(`Entry not found ${entryId}  >:/`);
        } else {
          setEntry(entry);
        }
      } catch (error) {
        console.log('Error: ', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    if (entryId === 'new') {
      setEntry({
        title: '',
        notes: '',
        photoUrl: '',
      });
      setLoading(false);
    } else if (entryId) {
      loadEntry(+entryId);
    } else {
      throw new Error('Error no Entry Id Provided :^)');
    }
  }, [entryId]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate('/');
    if (entryId === 'new') {
      addEntry(entry as UnsavedEntry);
    } else {
      updateEntry(entry as Entry);
    }
  }

  function handleDelete() {
    navigate('/');
    setConfirmationOpen(false);
    if (entryId) {
      removeEntry(+entryId);
    }
  }

  if (error) {
    return <div className="error-message">{`${error}`}</div>;
  }

  if (loading) {
    return <div>LOADING . . . </div>;
  }

  return (
    <div className="container">
      <div className="row">
        <div className="column-full d-flex justify-between">
          <h1 id="formH1">New Entry</h1>
        </div>
      </div>
      <form id="entryForm" onSubmit={handleSubmit}>
        <div className="row margin-bottom-1">
          <div className="column-half">
            <img
              className="input-b-radius form-image"
              id="formImage"
              src={
                entry?.photoUrl
                  ? entry.photoUrl
                  : '/images/placeholder-image-square.jpg'
              }
              alt="image of entry image"
            />
          </div>
          <div className="column-half">
            <label className="margin-bottom-1 d-block" htmlFor="title">
              Title
            </label>
            <input
              value={entry ? entry.title : ''}
              onChange={(e) => {
                if (entry) {
                  setEntry({ ...entry, title: e.target.value });
                }
              }}
              required
              className="input-b-color text-padding input-b-radius purple-outline input-height margin-bottom-2 d-block width-100"
              type="text"
              id="formTitle"
              name="formTitle"
            />
            <label className="margin-bottom-1 d-block" htmlFor="photoUrl">
              Photo URL
            </label>
            <input
              onChange={(e) => {
                if (entry) {
                  setEntry({ ...entry, photoUrl: e.target.value });
                }
              }}
              required
              className="input-b-color text-padding input-b-radius purple-outline input-height margin-bottom-2 d-block width-100"
              type="text"
              id="formURL"
              name="formURL"
              value={entry?.photoUrl ? entry.photoUrl : ''}
            />
          </div>
        </div>
        <div className="row margin-bottom-1">
          <div className="column-full">
            <label className="margin-bottom-1 d-block" htmlFor="formNotes">
              Notes
            </label>
            <textarea
              onChange={(e) => {
                if (entry) {
                  setEntry({ ...entry, notes: e.target.value });
                }
              }}
              value={entry?.notes ? entry.notes : ''}
              required
              className="input-b-color text-padding input-b-radius purple-outline d-block width-100"
              name="formNotes"
              id="formNotes"
              cols={30}
              rows={10}></textarea>
          </div>
        </div>
        <div className="row">
          <div className="column-full d-flex justify-between">
            {entryId !== 'new' && (
              <button
                onClick={() => setConfirmationOpen(true)}
                className=" delete-entry-button"
                type="button"
                id="deleteEntry">
                Delete Entry
              </button>
            )}
            <button className="input-b-radius text-padding purple-background white-text">
              SAVE
            </button>
            <Modal isOpen={confirmationOpen}>
              <p>Are you sure you want to delete?</p>
              <button type="button" onClick={() => setConfirmationOpen(false)}>
                Cancel
              </button>
              <button type="button" onClick={handleDelete}>
                Confirm
              </button>
            </Modal>
          </div>
        </div>
      </form>
    </div>
  );
}
