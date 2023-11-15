import fs from 'fs-extra';
import { Client } from 'pg';

const columns = [
	's.series_code',
	'series_name',
	'catch_copy',
	'meta_tag',
	'series_info_text_1',
	'series_info_text_2',
	'series_info_text_3',
	'series_info_text_4',
	'series_info_text_5',
	'series_notice_text',
	'alteration_notice_text',
	'digital_book_notice_text',
	'wysiwyg_contents_product_description',
	'wysiwyg_contents_specification',
	'wysiwyg_contents_price_list',
	'wysiwyg_contents_alterations',
	'wysiwyg_contents_days_to_ship',
	'wysiwyg_contents_spec_overview',
	'wysiwyg_contents_example',
	'wysiwyg_contents_general',
	'wysiwyg_contents_standard_spec',
];

(async () => extract())();

async function extract() {
	const client = new Client({ database: 'ect-api' });
	await client.connect();

	// SQL injection に気を付けてね。真似しちゃダメ。
	const query = `
		select ${columns.join()}
		from
			m_series_language sl
			left join m_series s on sl.series_code = s.series_code
		where
			s.hidden_display_flag != '1';
	`;

	const result = await client.query(query);
	fs.outputJSONSync('./series.json', result.rows);

	await client.end();
}
