import { Entry, readEntries } from './data';
import { EntryDisplay } from './EntryDisplay';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export function ViewEntries() {
  const [entries, setEntries] = useState<Entry[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | unknown>();

  useEffect(() => {
    async function loadEntries() {
      try {
        const read = await readEntries();
        setEntries(read);
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    loadEntries();
  }, []);

  if (loading) {
    return <div>LOADING . . .</div>;
  }

  if (error) {
    return <div className="error-message">{`${error}`}</div>;
  }

  return (
    <div className="container" data-view="entries">
      <div className="row">
        <div className="column-full d-flex justify-between align-center">
          <h1>Entries</h1>
          <h3>
            <Link
              to="/entry-form/new"
              id="formLink"
              className="white-text form-link">
              NEW
            </Link>
          </h3>
        </div>
      </div>
      <div className="row">
        <div className="column-full">
          {entries?.length ? (
            <ul className="entry-ul" id="entryUl">
              {entries.map((entry) => (
                <EntryDisplay key={entry.entryId} entry={entry} />
              ))}
            </ul>
          ) : (
            <div style={{ color: 'red' }}>NO ENTRIES </div>
          )}
        </div>
      </div>
    </div>
  );
}
