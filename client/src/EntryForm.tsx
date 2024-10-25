import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Entry, readEntry, UnsavedEntry } from './data';

export function EntryForm() {
  const { entryId } = useParams();
  const [entry, setEntry] = useState<Entry | UnsavedEntry>();

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
      }
    }
    if (entryId === 'new') {
      setEntry({
        title: '',
        notes: '',
        photoUrl: '',
      });
    } else if (entryId) {
      loadEntry(+entryId);
    } else {
      throw new Error('Error no Entry Id Provided :^)');
    }
  }, [entryId]);

  return (
    <div className="container">
      <div className="row">
        <div className="column-full d-flex justify-between">
          <h1 id="formH1">New Entry</h1>
        </div>
      </div>
      <form id="entryForm">
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
                  entry.title = e.target.value;
                  setEntry(entry);
                }
              }}
              required
              className="input-b-color text-padding input-b-radius purple-outline input-height margin-bottom-2 d-block width-100"
              type="text"
              id="formTitle"
              name="formTitle"
            />
            <label className="margin-bottom-1 d-block" htmlFor="photoUrk">
              Photo URL
            </label>
            <input
              onChange={(e) => {
                if (entry) {
                  console.log(entry);
                  entry.photoUrl = e.target.value;
                  setEntry(entry);
                }
                console.log(entry);
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
                  entry.notes = e.target.value;
                  setEntry(entry);
                }
              }}
              value={entry ? entry.notes : ''}
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
            <button
              className="invisible delete-entry-button"
              type="button"
              id="deleteEntry">
              Delete Entry
            </button>
            <button className="input-b-radius text-padding purple-background white-text">
              SAVE
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
