# FlowChart

## 文言定義

- モーダル A = showMessage (選択肢を表示せず、メッセージを表示するだけ)
- モーダル B = showConfirm (Next / Close の選択肢を表示し、ユーザの選択によって次の動作を決定する)

## Checkout flowChart

```mermaid
graph TB

    Start["チェックアウトクリック"]
    PreCheck{"別タブでチェックアウト可能<br />ユーザ以外でログインされた<br />or ログアウトされた"}
    Overstatement{"一度にチェックアウトできる<br />明細上限数を超えている"}
    modalDisplay["固定メッセージをモーダルAに表示する"]
    PriceCheck["価格チェックし、価格チェックに成功"]
    reloadDisplay["画面リロード"]
    isPurchaseUser{"購買連携ユーザか"}
    A0{"価格チェックAPIから<br />禁止ブランド<br />or 禁止インナー<br />or 禁止分析コード<br />or 単価上限超過エラーが<br />返却されたか"}
    A1{"API006417のエラー<br />メッセージが返っているか"}
    A2["API006417のerrorMessageを<br />errorとしてmessageList に追加"]
    A3["固定メッセージを<br />errorとしてmessageList に追加"]
    A4{"チェックアウト可能ユーザか<br />(noになることはない)"}
    A5{"API006417のエラー<br />メッセージが返っているか"}
    A6["API006417のerrorMessageを<br />errorとしてmessageList に追加"]
    A7{"型番に禁止文字が<br />使われている"}
    A8["messageListに固定メッセージを<br />errorとして追加"]
    A9{"API006416のエラー<br />メッセージが返っているか"}
    A10["messageListにAPI006416メッセージを<br />warnとして追加"]
    A11{"チェックアウト可能ユーザかつ<br />単価が返却されている　かつ<br />単価が 0 より大きい　かつ<br />型番に禁止文字が使われていない　かつ<br />API006417エラーがないか、あってもUFチェックアウト可能ユーザである　かつ<br />WOS032エラーがない"}
    B0{"messageList にメッセージがある　かつ<br />価格チェックAPIレスポンスのunfitTypeが存在し0(not unfit)でない　かつ<br />UFチェックアウト可能ユーザではない"}
    B1["messageList をモーダルAに表示する"]
    B2["後続を実行しない"]
    B3{"messageList にメッセージがある"}
    B4["messageList をモーダルBに表示する。"]
    B5{"ユーザがNextをクリック"}
    B6["後続を実行する(チェックアウトする)"]

    Start-->PreCheck
    PreCheck-->|Yes|reloadDisplay
    PreCheck-->|No|Overstatement
    Overstatement-->|Yes|modalDisplay
    Overstatement-->|No|PriceCheck
    modalDisplay---->B2
    PriceCheck-->isPurchaseUser
    isPurchaseUser-->|Yes|A0
    isPurchaseUser-->|No|B6
    A0-->|Yes|A1
    A1-->|Yes|A2
    A1-->|No|A3
    A0-->|No|A4
    A4-->|Yes|A5
    A5-->|Yes|A6
    A6-->A7
    A7-->|Yes|A8
    A8-->A9
    A9-->|Yes|A10
    A5-->|No|A7
    A7-->|No|A9
    A2------->A11
    A3------->A11
    A10-->A11
    A9-->|No|A11
    A11-->|Yes|B0
    B0------>|Yes|B1
    B0------>|No|B3
    A11-->|No|B1
    B1------>B2
    B3-->|Yes|B4
    B3------>|No|B6
    B4-->B5
    B5------>|Yes|B6
    B5------>|No|B2
```

## Add to cart or Add to my component flowchart

- 前提条件
  - ログイン済みまたはチェックイン済み

```mermaid
graph TB

    Start["カートに追加 or My部品表を追加をクリック"]
    PriceCheck["価格チェック成功"]
    isPurchaseUser{"購買連携ユーザか"}
    A0{"価格チェックAPIから<br />禁止ブランド<br />or 禁止インナー<br />or 禁止分析コード<br />or 単価上限超過エラーが<br />返却されたか"}
    A1{"API006417のエラー<br />メッセージが返っているか"}
    A2["API006417のerrorMessageを<br />errorとしてmessageList に追加"]
    A3["固定メッセージを<br />errorとしてmessageList に追加"]
    A4{"チェックアウト可能ユーザか"}
    A5{"API006417のエラー<br />メッセージが返っているか"}
    A6["API006417のerrorMessageを<br />errorとしてmessageList に追加"]
    A7{"型番に禁止文字が<br />使われている"}
    A8["messageListに固定メッセージを<br />errorとして追加"]
    A9{"API006416のエラーメッセージ<br />が返っているか"}
    A10["API006416のerrorMessageを<br />warnとしてmessageListに追加"]

    B0{"チェックアウト可能ユーザか"}
    B1{"messageList が空か"}
    B2{"messageList が空か"}
    B3{"チェックアウト可能ユーザ　かつ<br />単価が返却されている　かつ<br />単価が 0 より大きい　かつ<br />型番に禁止文字が使われていない　かつ<br />{ API006417エラーがない　或いは<br />UFチェックアウト可能ユーザである }　かつ<br />WOS032エラーがない"}
    B4{"チェックアウト可能ユーザ　かつ<br />単価が返却されている　かつ<br />単価が 0 より大きい　かつ<br />型番に禁止文字が使われていない　かつ<br />{ API006417エラーがない　或いは<br />UFチェックアウト可能ユーザである }　かつ<br />WOS032エラーがない"}
    B5["固定メッセージをモーダルAに表示する<br />(カート追加なのかMy部品表追加なのかによってメッセージは異なる)"]
    B6["messageList をモーダルAに表示する"]
    B7["messageList をモーダルBに表示する。"]
    B8{"ユーザがNextをクリック"}
    Continue["後続を実行する<br />(カート追加 or My部品表追加する)"]
    Cancel["後続を実行しない"]

    Start-->PriceCheck
    PriceCheck-->|Yes|isPurchaseUser
    isPurchaseUser-->|Yes|A0
    A0-->|Yes|A1
    A1-->|Yes|A2
    A1-->|No|A3
    A0-->|No|A4
    A4-->|Yes|A5
    A5-->|Yes|A6
    A6-->A7
    A7-->|Yes|A8
    A8-->A9
    A9-->|Yes|A10
    A5-->|No|A7
    A7-->|No|A9
    A2------->B0
    A3------->B0
    A10-->B0
    A9-->|No|B0
    B0-->|Yes|B1
    B1-->|Yes|B3
    B3-------->|Yes|Continue
    B3-->|No|B5
    B5-------->Cancel
    B1-->|No|B4
    B4-->|Yes|B7
    B7-->B8
    B8-------->|Yes|Continue
    B8-------->|No|Cancel
    B4-->|No|B6
    B6-------->Cancel
    B0-->|No|B2
    B2-------->|Yes|Continue
    B2-->|No|B6
    A4-->|No|B2
    isPurchaseUser-------->|No|Continue
```
