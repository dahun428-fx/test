# specs

- [ ] specUnit が与えられたら「{{specUnit}} Unit(s)」のフォーマットで specUnit を表示する。
- [ ] specUnit に HTML が入っていたらサニタイズせず HTML をそのまま解釈して specUnit を表示する。
- [ ] specUnit がない場合 specUnit は表示されず、「{{specUnit}} Unit(s)」全体が表示されない。
- [ ] 「xxx」を入力して blur すると数値を入力せよというエラーモーダルが表示される。
- [ ] 「11.11111」を入力して blur すると小数点以下の桁数は 4 桁以内にせよというエラーモーダルが表示される。
- [ ] 表示された範囲外の数値を入力して blur すると範囲内の数値を入力せよというエラーモーダルが表示される。
- [ ] 数値入力エリアで Enter キーを押すと blur される
- [ ] specValue に undefined を与えて、入力エリアに focus して blur すると、onBlur で空文字が渡される。
- [ ] minValue, maxValue, stepValue いずれかが undefined の場合、数値範囲は表示されない。
- [ ] minValue, maxValue, stepValue いずれかが undefined の場合、数値範囲は無効になりバリデーションチェック対象外となる。
- [ ] specValueRangeList が空配列の場合、すべての数値が許容される。
