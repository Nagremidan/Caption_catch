import PrintableLayout from '../PrintableLayout';

export const metadata = {
  title: "Printable Driver Report",
  description: 'Printable report for drivers and buses',
};

export default function PrintableReportLayout({ children }) {
  return <PrintableLayout>{children}</PrintableLayout>;
}