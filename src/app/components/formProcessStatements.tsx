import { generateCSV } from '@/app/actions/processStatements';
import LocaleInput from '@/app/components/inputLocale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function FormProcessStatements() {
  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="statementsCSV">Statements CSV file:</Label>
        <Input 
          id="statementsCSV"
          type="file" 
          name="statementsCSV" 
          accept=".csv" 
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="statementsPDF">Statements PDF file:</Label>
        <Input 
          id="statementsPDF"
          type="file" 
          name="statementsPDF" 
          accept=".pdf" 
          required 
        />
      </div>
      <LocaleInput />
      <Button formAction={generateCSV} type="submit" className="w-full">
        Generate CSV
      </Button>
    </form>
  );
}
