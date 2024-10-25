import { Route, Routes } from 'react-router-dom';
import { Header } from './Header';
import { EntryForm } from './EntryForm';
import { ViewEntries } from './ViewEntries';
import { NotFound } from './NotFound';
import './layout.css';
import './styles.css';
import './reset.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Header />}>
        <Route path="entry-form/:entryId" element={<EntryForm />} />
        <Route index element={<ViewEntries />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
