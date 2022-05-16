---
slug: perf-in-frontend-development
title: Performance in Frontend development
authors: [liam_vo]
tags: [performance, frontend]
---

<h3>Có nhiều yếu tố khi nói về hiệu năng của một ứng dụng ở Frontend. Dưới view nhìn tổng quát, mình sẽ chia ra làm 3 vấn đề chính:</h3>

1. <b>Vấn đề 1: Network load performance</b>

OK hãy nghĩ về tình huống sau. Ta sẽ build một single page app. Oh, bạn đang cần truy cập tới website này, hãy để tôi(server) sẽ gửi source code tới ứng dụng và bạn - client sẽ xử lý nó nhé. Ta sẽ xử lý như caching header, vân vân...

<!--truncate-->
Vấn đề đặt ra là mất bao lâu để bạn có thể get được source code và xử lý nó.

2. <b>Vấn đề 2: Javascript perfomance. Đó là parsing và compile Javascript</b>

Nếu server side gửi về client source code qúa khó để parse và compile. ĐÓ là vấn đề.

Rõ ràng perfomance không phải vấn đề với chiếc macbook pro, nhưng với một con điện thoại samsung ghẻ, đó là vấn đề.

3. <b>Vấn đề 3: Rendering</b>

Xử lý ở phần client, build component,...để render ra UI giao diện cho người dùng.

:::note

Vấn đề cần đặt ra ở đây là: Ứng dụng của bạn cần gì? Sẽ luôn có sự đánh đổi được và mất ở đây. Ứng dụng gmail có thể để loading bar, và người dùng chấp nhận chờ đợi nó mặc dù có thể chuyển tab. Nhưng với facebook, instagram...loading bar xuất hiện là điều không thể chấp nhận được. OK! Hãy suy nghĩ về `tradeoffs`!

:::

<h4>I. Javascript Perfomance</h4>

- Phần lớn thời gian và efford ở đây là việc nén file assets, remove bớt request, giảm tốc độ xử lý request, nhưng một khi ứng dụng running, điều cần quan tâm ở đây là gì?

<b>Các bước code Js được thực thi ở client</b>

> 1. Code JS được get từ cloud service về client
> 2. Code JS được parse. Qúa trình parse này sẽ tạo ra đoạn mã dạng AST
> 3. Đoạn mã AST sẽ được compile thành bytecode
> 4. Byte code được computer đọc và trả về UI cho người dùng

a. <b>Parsing</b>

Parsing tốn khá nhiều thời gian. Thậm chí qúa trình này có thể 1 MB/s trên mobile. Cách đầu tiên đề giảm thời gian parsing đó chính là gỉam lượng code được parse. Cách thứ hai đó chính là chỉ parsing những đoạn code nào bạn cần, và parsing từ từ.

Parsing được chia làm 2 phase: Eager và Lazy:

- Eager: Full parse
- Lazy: Ta sẽ chỉ parse đoạn mã này khi cần.

Điều đó được tóm tắt: JS engine sẽ scan qua top level scope. Parse tất cả những đoạn code đang cần để thực hiện. Và bỏ qua những thứ kiểu như functions declaration và class. Những thứ đó chỉ được parse khi cần.

<b>Vấn đề ở đây là:</b>

```js
    const a = 1;
    const b = 2;

    function add(a, b) {
        return a + b
    }

    add(a, b)
```

Như đã nói ở trên, JS engine sẽ bỏ qua function add và sẽ parse tiếp xuống phía dưới, và nó phải quay lại để parse lại function add. Điều này làm giam performance của app. Cách giải quyết ở đây là wrap function đó lại và điều đó dẫn đến việc nó sẽ được thực thi ngay

```js
    const a = 1;
    const b = 2;

    (function add(a, b) {
        return a + b
    });

    add(a, b)
```

Không phải lúc nào điều này cũng là hợp lý. Vấn đề ở đây nếu bạn nghĩ đó là vấn đề, đó là cách giải quyết, thì hãy sử dụng. Còn không hãy bỏ qua, vì nó cũng có những vấn đề khác gặp phải.

<h4>II. Rendering</h4>

<b>a. CSS</b>

Khi get CSS từ server và build thành CSSOM, browser cần tính toán xem những rules nào được apply vào element nào, những rule nào được ưu tiên hơn so với rule nào. Và đó là vấn đề cần được optimize ở đây. Luôn nhớ rằng, bạn xử lý phức tạp thì nó càng tốn time. Ví dụ nếu dùng class bình thường thì khá dễ để figure out, nhưng với kiểu style element dùng dạng nth-child(4n +1) hay `last-child` thì lại tốn nhiều time hơn để xử lý. 

> Hãy sử dụng class đơn giản khi có thể. VÍ dụ follow theo cú pháp BEM

:::tip

- Sử dụng selector đơn gian nếu có thể
- Giảm bớt lượng element chịu ảnh hưởng bởi style. Bởi vì là nó sẽ giamr bớt thời gian tính toán, và thêm vào đó giảm lượng code được trả về client.
- Giảm bớt CSS dư thừa. Càng nhiều CSS thì càng tốn time để check
- Có thể sử dụng media queries ở `Link` tag
- Inline CSS

:::


<b>b. Javascript</b>

Javascript có thể thay đổi layout thông qua việc style inline, sửa đổi một object style... Tuy nhiên đôi khi không nhất thiết các style phải thay đổi đồng loạt. Chẳng hạn khi responsive thì background không change, tuy nhiên, JS vẫn tính toán và trả về kết qủa là các style inline. Điều này là trùng lặp không cần thiết. Do đó cần được optimize.

:::tip

- Defer Javascript 
- Sử dụng `async` attribute ở `script` tag

:::

<b>c. Layout và Reflows</b>

Layout là qúa trình build UI lên webpage và reflows là qúa trình re-layout khi có sự thay đổi. Và qúa trình Reflow là một trong những nguyên nhân gây ảnh hưởng tới performance - DOM script, đặc biệt ở các thiết bị có khả năng xử lý kém như mobile. Trong nhiều trường hợp, nó ảnh hưởng tới mức layout lại toàn bộ page.

- Reflow là block operation. Mọi thứ bị block trong qúa trình reflow. Code JS bị tạm dừng thực thi.
- Reflow tiêu tốn kha khá CPU
- Người dùng có thể nhận biết được qúa trình này nếu nó xảy ra.

Hãy nhớ rằng khi reflow một element thì những parent hay children element của nó đều bị reflow. Vậy những gì gây ra việc reflow:

1. Resize window
2. Change font
3. Change content
4. Add/remove stylesheet
5. Add/remove class
6. Add/remove element
7. Change orientation(xoay ngang màn hình trên mobile chẳng hạn)
8. Tính toán lại size hay position
9. Thay đổi size hay position
...

Vậy có cách nào để tránh việc reflow:

:::tip

- Thay đổi class ở DOM tree level thấp nhất
- Tránh việc modify inline style thường xuyên
- Tránh layout table
- Batch DOM manipulation
- Debounce sự kiện window resize
- Opmize tốc độ của animation

:::

<b>d. Layout thrashing</b>

Khi code JS chạy, sau đó style được tính toán và layout rồi paint. Qúa trình này là đồng bộ. Do đó sẽ có những trường hợp qúa trình re-caculate diễn ra liên tục, chẳng hạn trong vòng lặp, nó khiến cho performance bị giam đi, qúa trình này gọi là layout thrashing.

Để tránh gặp phải vấn đề này, về  tư tưởng là ta sẽ thực hiện caculate tất cả những gì cần thiết sau đó mới change. Nó giups browser không phải thực hiện trùng lặp các thao tác thừa. Qúa trình đó gọi là forced synchronous layout. 

Có một thư viện gọi là fastdom giúp thực hiện việc này. Thực tế những lib như React giúp ta tránh được tình trạng layout thrashing bởi việc lưu caculate vào state rồi mới change dom. Tất nhiên là phụ thuộc vào cách implement, sẽ có trường hợp không tránh được, do đó cần phân tích xem chỗ nào gây ra tình trạng này để có cách xử lý hợp lý.

<b>e. Painting</b>

Sau khi layout thì qúa trình tiếp theo là painting. Tuy nhiên, không phải lúc nào painting cũng trigger bởi layout. Ví dụ change size, layout change và trigger repaint. Nhuưng change background thì layout sẽ không được reflow, mà repaint sẽ được trigger ngay.

<h4>III. Network</h4>

<b>Vendor bundles are anti pattern</b>

So many peope who obsess like I can't synthetically get these three modules to be in this one bundle by using common chunks. So many people to froth at the mouth obsessed about trying to obtimize caching.
By Caching, you only saving yourself the network time it takes to get the file. In some browsers, you might get byte code caching but that's just parse cost javascript, that's not eval and execute. 
So you're doing yourself very little favors by trying to optimize for caching versus trying to optimize for the smallest amount of code that you actually need on your initial download of your page, right?
So what you would find out is that by trying to do a bunch of caching, you end up with these ginormous bundles that you force entry points to ship down the pipe on your initial download/
So I shouldn't discount caching as an optimization, it is still valuecable, but what I tend to say, maybe this is a little brash. But by code splitting, you can save many second, but with caching, it only mili seconds.