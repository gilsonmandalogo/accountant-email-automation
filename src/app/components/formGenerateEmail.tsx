import InputLocale from '@/app/components/inputLocale';
import SelectMonth from '@/app/components/selectMonth';

export default function FormGenerateEmail() {
  return (
    <form className="vertical gap">
      <SelectMonth />
      <InputLocale />
      <button
        formAction="/api/generate-email"
        formMethod="POST"
      >
        Generate email
      </button>
    </form>
  );
}
