import { generateCSV } from '@/app/actions/processStatements';

export default function FormProcessStatements() {
  return (
    <form className="vertical gap">
      <label>
        Statements CSV file:
        <input type="file" name="statementsCSV" accept=".csv" required />
      </label>
      <label>
        Statements PDF file:
        <input type="file" name="statementsPDF" accept=".pdf" required />
      </label>
      <button formAction={generateCSV}>Generate CSV</button>
    </form>
  );
}
