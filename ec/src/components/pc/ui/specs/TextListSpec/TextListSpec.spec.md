# specs

- [ ] specViewType が specViewType.List かつ partNumberSpec.numericSpec を持っていないかつ選択済みのスペックを持っていない場合、TextField が表示される。
- [ ] hiddenFlag が false である specValue が 1 つ以上あり、specValueDisp と input の text と一致する内容がなければ「候補がない」エラーメッセージを表示する
- [ ] TextField に値を入力すると、 specValue が持つそれぞれの specValueDisp と比較して一致するものだけを候補リストとして出力する。
- [ ] TextField の入力値によって出力されたリストのチェックボックスを選択した後、チェックボックスを外すと TextField の値が保持された状態で、絞り込まれたリストも保持している状態となる。
- [ ] specFrame において、clear ボタンを押下すると、TextField には空文字がセットされ、選択されたスペック情報として `{ [specCode]: [] }` が API リクエストに乗せる値として onChange がコールされる。
- [ ] hiddenFlag が false の partNumberSpec.numericSpec を持っている場合は、 NumericSpecField が表示される。
- [ ] チェックボックスが 1 つもチェックされていない状態で、1 つをクリックすると、他のチェックボックスが非表示になる、背景色が灰色になる、clear リンクが表示する。
- [ ] (API 結合テスト) NumericSpecField の input に入力した値が、リストの中と一致している場合は、チェックボックスが選択された状態となる。チェックボックスを外すと input の値も '' となり未選択状態となる。
- [ ] (API 結合テスト) NumericSpecField の input に入力した値が規定の範囲内であれば、その値によって一意となる他スペックに関して、背景色が変わる。
- [ ] (API 結合テスト) 1 つのチェックボックスしかチェックされていない状態で、チェックされたチェックボックスをクリックすると、全てのチェックボックスを表示するように、背景色を白色に戻す。
