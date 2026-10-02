import Faq from '../../components/faq/Faq';
import type { Props } from './FaqReactRC';

function FaqReact({ title, items }: Props) {
	return <Faq title={title} items={items} />;
}

export default FaqReact;
