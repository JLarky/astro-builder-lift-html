import Faq from '../../components/faq/Faq';
import type { Props } from './FaqReactBrokenRC';

function FaqReactBroken({ title, items }: Props) {
	return <Faq title={title} items={items} />;
}

export default FaqReactBroken;
