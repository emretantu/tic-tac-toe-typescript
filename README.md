# Tic Tac Toe With TypeScript

## Overview

Thanks for checking out this front-end coding challenge.

This is a classic Tic Tac Toe game featuring multiplayer or VS CPU game modes, along with various difficulty settings.

[Live Demo](https://emretantu.github.io/tic-tac-toe-typescript/)

## Table of Contents
- [Project source](#project-source)
- [The challenge](#the-challenge)
- [Screenshot](#screenshot)
- [Links](#links)
- [Built with (tech-stack)](#built-with-tech-stack)
- [What you need to know](#what-you-need-to-know)
- [The Minimax Algorithm and the Strategic Humanization of AI](#the-minimax-algorithm-and-the-strategic-humanization-of-ai)
- [Author](#author)

## Project source

This is a Frontend Mentor project. You can find the details under [Useful resources](#useful-resources).

## The challenge

Users should be able to:

- View the optimal layout for the game depending on their device's screen size
- See hover states for all interactive elements on the page
- Play the game either solo vs the computer or multiplayer against another person
- **Bonus 1**: Save the game state in the browser so that it’s preserved if the player refreshes their browser
- **Bonus 2**: Instead of having the computer randomly make its moves, try making it clever so it’s proactive in blocking your moves and trying to win
- **Bonus 3**: If your "clever" approach uses the **Minimax algorithm**, the human player will have no chance of winning; they will either tie or lose. To overcome this, you can adjust the Minimax logic to allow for human wins and even implement different difficulty modes.

**Expected behavior**

- You can choose to make the default screen either the new game menu or the solo player game board. Note that we're using the solo player game board for the design screenshot, so if you choose the new game menu it won't match up in the design comparison slider. This isn't a big deal, but is something worth considering.
- On the new game screen, whichever mark isn't selected for the first player is automatically assigned to the second player when the game is started.
- The first turn of the first round is always played by whoever is playing as X. For every following round, the first turn alternates between O and X.
- After a round, if the player chooses to quit the game, they should be taken back to the new game menu.
- If the restart icon in the top right is clicked, the "Restart game?" modal should show and allow the player to reset the game or cancel and continue to play.

## Screenshot

<img src="./screenshots/tic-tac-toe-gaming.png" height="300px"> <img src="./screenshots/tic-tac-toe-start-screen.png" height="300px"> <img src="./screenshots/tic-tac-toe-restart-game-modal.png" height="300px">

<img src="./screenshots/tic-tac-toe-round-tied-modal.png" height="300px"> <img src="./screenshots/tic-tac-toe-x-takes-the-round-modal.png" height="300px"> <img src="./screenshots/tic-tac-toe-o-takes-the-round-modal.png" height="300px">

## Links

- [Live Demo](https://emretantu.github.io/tic-tac-toe-typescript/)
- [Frontend Mentor Tic Tac Toe Challenge](https://www.frontendmentor.io/challenges/tic-tac-toe-game-Re7ZF_E2v)

## Built with (tech stack)

- HTML
- CSS
- TypeScript

## What You Need to Know

- The tech stack listed above
- TS concepts and features

## The Minimax Algorithm and the Strategic Humanization of AI

In "VS CPU" mode, the game becomes uninteresting if the computer only makes random moves. The most established method for creating intelligent opponents is the **Minimax algorithm**. In short, Minimax operates on the premise that the opponent will always play optimally, leading the AI to seek the most secure path. It constructs a decision tree of all possible moves from the current **state** until it reaches the end of the game. Each **node** represents a state, and each connection represents a move. The **leaf nodes** represent the **terminal states**: typically, a computer win is scored as +1, a draw as 0, and a human win as -1.

At each depth, the algorithm checks the child nodes of the current player. The **maximizer** (the computer) tries to maximize the score by avoiding branches that lead to low values. When it is the **minimizer's** (human) turn, the goal is to choose the lowest possible value. These values propagate from the terminal states back to the **root state**, allowing the computer to select the move with the highest guaranteed score.

**The First Problem**: When we assign fixed values like +1 for a win, 0 for a draw, and -1 for a loss, Minimax suffers from "depth blindness." Because the algorithm utilizes **Depth First Search (DFS)**, it sees no difference between a win in 1 move and a win in 5 moves. If it discovers a distant win last, it may prioritize it over an immediate win. To a human player, this looks irrational or as if the computer is "toying with its prey," which can be frustrating.

To solve this, I made the algorithm **depth-aware**. I subtracted the depth from winning scores and added it to losing scores. I calibrated the scoring system so that even the most distant win remains at least +1. This ensures that Minimax chooses not just the most guaranteed path, but also the **shortest path** to victory.

**The Second Problem**: A perfectly implemented Minimax algorithm is unbeatable; it either wins or forces a draw. While this solves the problem of "random play," it introduces the boredom of an "impossible game." Playing against a machine that never makes a mistake is discouraging. A common fix is to make the AI play the best move 90% of the time and a random move 10% of the time. However, this feels unrealistic, as an otherwise brilliant AI might suddenly miss a glaringly obvious winning move.

**The Solution**: Instead of simply picking the best move, my implementation records all possible moves and their values into an array, sorted from the best possible outcome to the worst. Human players generally try to make the best move they can see, which is often close to—but not always exactly—the absolute optimal move. 

To select a move from this sorted list, consider this linear formula:

$$\text{floor}(r \times \text{MovesArrayLength}), \quad r \in [0,1)$$

This gives every move an equal probability, which reverts the game to random play. However, by applying an exponent ($P$) to the random variable $r$, we can bend the probability curve:

$$\text{floor}\big((r^{P}) \times \text{MovesArrayLength}\big), \quad r \in [0,1), \; P > 0$$

As $P$ increases, the results gravitate heavily toward 0 (the best move). Even though $r$ is a random value between [0, 1), the result of $r^P$ yields values much closer to 0. This allows the AI to prioritize the optimal move while occasionally choosing "near-optimal" alternatives. The probability of selecting a disastrously bad move becomes nearly zero.

I categorized the difficulty levels based on these $P$ values:

```ts
enum Difficulty {
  Noob = 1,
  Easy = 2,
  Medium = 4,
  Hard = 16,
  Imposible = 0
}
```
Impossible (0) mode, the probabilistic formula is bypassed, and the algorithm plays a flawless, unbeatable game by directly selecting the optimal move from the original Minimax.

## Author

**Emre Tantu**
- Website - [emretantu.dev](https://www.emretantu.dev)
- Contact - [hello@emretantu.dev](mailto:hello@emretantu.dev)
- LinkedIn - [in/emretantu](https://www.linkedin.com/in/emretantu/)
- Twitter - [@emretantu](https://www.twitter.com/emretantu)

---
---

# 🇹🇷 Tic Tac Toe - TypeScript İle

## Genel Bakış

Bu front-end coding challenge projesine göz attığınız için teşekkürler.

Bu proje, multiplayer veya CPU'ya karşı oyun modları ve zorluk seçenekleri sunan klasik bir Tic Tac Toe oyunudur.

[Live Demo](https://emretantu.github.io/tic-tac-toe-typescript/)

## İçindekiler
- [Proje kaynağı](#proje-kaynagi)
- [İsterler (Gereksinimler)](#isterler-gereksinimler)
- [Ekran Görüntüleri](#ekran-goruntuleri)
- [Linkler](#linkler)
- [Kullanılan Teknolojiler](#kullanilan-teknolojiler)
- [Bilmeniz Gerekenler](#bilmeniz-gerekenler)
- [Minimax Algoritması ve Minimax'i "İnsanlaştırmanın" En İyi Yolu](#minimax-algoritması-ve-minimaxi-i̇nsanlaştırmanın-en-i̇yi-yolu)
- [Yazar](#yazar)

## Proje kaynağı

Bu bir Frontend Mentor projesidir. Detayları [Useful resources](#useful-resources) altında bulabilirsiniz.

## İsterler (Gereksinimler)

Kullanıcı şunları yapabilmelidir:

- Cihaz ekran boyutuna göre optimize edilmiş **layout**'u görebilmeli.
- Sayfadaki tüm interaktif elementler için **hover state**'lerini görebilmeli.
- Oyunu bilgisayara karşı (solo) veya başka birine karşı (multiplayer) oynayabilmeli.
- **Bonus 1**: Oyunun durumunu (**state**) tarayıcıda kaydedebilmeli, böylece sayfa yenilendiğinde ilerleme korunmalı.
- **Bonus 2**: Bilgisayarın rastgele hamle yapması yerine, hamleleri önceden sezip engelleyen ve kazanmaya çalışan zeki bir mantık kurgulanmalı.
- **Bonus 3**: Eğer zeki yönteminiz **Minimax algoritması** ise, insan oyuncunun kazanma şansı olmayacaktır; ya berabere kalacak ya da kaybedecektir. Bu durumu aşmak için **Minimax** mantığını esnetebilir ve farklı zorluk modları ekleyebilirsiniz.

**Beklenen Davranışlar**

- Varsayılan ekranı "Yeni Oyun Menüsü" veya "Solo Oyun Tahtası" olarak seçebilirsiniz. (Ekran görüntülerinde solo tahta kullanıldığı için tasarım karşılaştırmasında bu durum dikkate alınmalıdır).
- Yeni oyun ekranında, birinci oyuncu için seçilmeyen işaret, oyun başladığında otomatik olarak ikinci oyuncuya atanır.
- İlk turun ilk hamlesini her zaman X olarak oynayan yapar. Sonraki her turda, ilk hamle O ve X arasında değişir.
- Bir turdan sonra, oyuncu oyundan çıkmak isterse ana menüye yönlendirilmelidir.
- Sağ üstteki **restart** ikonuna tıklandığında, "Oyunu sıfırla?" (**Restart game?**) **modal**'ı görünmeli; oyuncu oyunu sıfırlayabilmeli veya iptal edip devam edebilmeli.

## Ekran Görüntüleri

<img src="./screenshots/tic-tac-toe-gaming.png" height="300px"> <img src="./screenshots/tic-tac-toe-start-screen.png" height="300px"> <img src="./screenshots/tic-tac-toe-restart-game-modal.png" height="300px">

<img src="./screenshots/tic-tac-toe-round-tied-modal.png" height="300px"> <img src="./screenshots/tic-tac-toe-x-takes-the-round-modal.png" height="300px"> <img src="./screenshots/tic-tac-toe-o-takes-the-round-modal.png" height="300px">

## Linkler

- [Live Demo](https://emretantu.github.io/tic-tac-toe-typescript/)
- [Frontend Mentor Tic Tac Toe Challenge](https://www.frontendmentor.io/challenges/tic-tac-toe-game-Re7ZF_E2v)

## Kullanılan Teknolojiler

- HTML
- CSS
- TypeScript

## Bilmeniz Gerekenler

- Yukarıdaki **tech stack** bilgisi.
- TypeScript konseptleri ve özellikleri.

## Minimax Algoritması ve Minimax'i "İnsanlaştırmanın" En İyi Yolu

"VS CPU" modunda bilgisayarın sadece rastgele hamleler yapması oyun deneyimini verimsizleştirir. Bilgisayarı akıllı hale getirmenin en kabul görmüş yolu **Minimax** algoritmasıdır. Bu algoritma özetle şunu yapar: Bilgisayar, rakibinin de her zaman en optimal hamleyi yapacağını varsayarak en garantici stratejiyi arar. Bu noktada mevcut durumdan (**state**) yapılabilecek olası hamlelerle final durumlara ulaşılarak bir karar ağacı oluşturulur. Her **node** bir durumu, her bağlantı ise bir hamleyi temsil eder. **Leaf node**'lar ise oyunun bitiş durumlarını (**terminal state**) temsil eder: Genelde bilgisayarın kazanması +1, beraberlik 0, rakibin (insan oyuncu) kazanması ise -1 olarak puanlanır.

Her derinlikte hamle sırası kimdeyse o düğümün alt dallarına bakılır; **maximizer** (bilgisayar) küçük değerlerin olduğu yapraklardan kaçınarak puanı maksimize etmeye çalışır. Sıra **minimizer** tarafındayken tam tersi bir bakış açısıyla en düşük değer hedeflenir. Değerler bu şekilde terminal state'lerden **root state**'e doğru taşınır ve bilgisayar kendisi için en yüksek puanlı hamleyi seçerek garantici bir oyun sergiler.

**Birinci Sorun**: Minimax'te kazanç durumunu +1, beraberlik durumunu 0, kaybetme durumunu -1 olarak atadığımızda "derinlik körlüğü" oluşur. Algoritma **Depth First Search (DFS)** mantığıyla çalıştığı için ağacın sığ kısımlarındaki (hemen gerçekleşecek) bir galibiyet ile çok daha derindeki bir galibiyet arasında puan farkı görmez. Eğer algoritma en son derindeki bir kazanç durumunu keşfettiyse, bariz olan kısa yolu bırakıp o hamleyi seçebilir. Bu da insan oyuncu gözünde bilgisayarın rasyonel olmayan bir hamle yaptığı veya "avıyla oynadığı" hissini uyandırarak sinir bozucu olabilir.

Bu sorunu çözmek için algoritmayı derinlik duyarlı (**depth-aware**) hale getirdim. Kazanç durumunda galibiyet puanından derinliği çıkardım; kayıp durumunda ise puanına derinliği ekledim. Puan sistemini, en derindeki bir kazancın bile en az +1 kalacağı şekilde ayarladım. Böylece Minimax sadece en garantici yolu değil, aynı zamanda **en kısa yolu** tercih eder hale geldi.

**İkinci Sorun**: Kusursuz bir Minimax algoritması asla kaybetmez; ya kazanır ya berabere kalır. Bu durum, "rastgele oyun" sıkıcılığından kaçarken "imkansız oyun" sıkıcılığına düşmemize neden olur. Hatasız bir makineye karşı oynamak keyifsizdir. Bilgisayarın tıpkı insanlar gibi makul hatalar yapması için genelde "en iyi hamleyi %90 ihtimalle yap, %10 ihtimalle rastgele oyna" mantığı kullanılır. Ancak bu, çok akıllıca oynayan birinin aniden gün gibi ortada olan bir hamleyi kaçırması gibi gerçek dışı durumlara yol açar.

**Çözüm**: Minimax her adımda en iyi hamleyi bulduğunda onu doğrudan uygulamak yerine, bulduğu tüm hamleleri değerleriyle birlikte bir diziye kaydeder ve bunları en iyi kazançtan en kötü kayba doğru sıralar. İnsanlar da aslında yapabildikleri en iyi hamleyi yaparlar ama bu bazen "mutlak en iyi"den biraz daha zayıf olabilir. 

Sıralanmış hamle listesinden seçim yaparken şu lineer formülü düşünelim:

$$\text{floor}(r \times \text{MovesArrayLength}), \quad r \in [0,1)$$

Bu formül her hamleye eşit seçilme şansı verir ki bu da oyunu tekrar tamamen rastgele yapar. Ancak random üretilen $r$ değerinin kuvvetini ($P$) alırsak grafik bükülür:

$$\text{floor}\big((r^{P}) \times \text{MovesArrayLength}\big), \quad r \in [0,1), \; P > 0$$

$P$ değerini artırdıkça sonuçlar dramatik bir şekilde 0'a (yani en iyi hamleye) yığılır. $r$ [0, 1) aralığında rastgele olsa bile, $r^P$ değeri 0'a çok daha yakın sonuçlar üretir. Böylece bilgisayar yüksek ihtimalle en iyi hamleyi, düşük ihtimalle ise en iyiye en yakın "makul" hamleleri seçer. Çok kötü hamlelerin seçilme ihtimali ise neredeyse sıfıra iner.

Zorluk düzeylerini bu $P$ değerlerine göre şu şekilde isimlendirdim:

```ts
enum Difficulty {
  Noob = 1,
  Easy = 2,
  Medium = 4,
  Hard = 16,
  Imposible = 0
}
```
Impossible (0) durumunda olasılık formülü uygulanmaz; algoritma doğrudan orijinal Minimax'in en iyi hamlesini seçerek kusursuz ve yenilmez bir oyun sergiler.

## Yazar

**Emre Tantu**
- Website - [emretantu.dev](https://www.emretantu.dev)
- İletişim - [hello@emretantu.dev](mailto:hello@emretantu.dev)
- LinkedIn - [in/emretantu](https://www.linkedin.com/in/emretantu/)
- Twitter - [@emretantu](https://www.twitter.com/emretantu)