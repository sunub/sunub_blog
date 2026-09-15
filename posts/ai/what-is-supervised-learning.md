---
tags:
  - ai
  - machine-learning
  - supervised-learning
  - logistic-regression
  - transformer
  - pytorch
title: 지도학습과 Transformer 모델 학습
date: 2026-09-05
summary: 지도학습의 분류 문제와 로지스틱 회귀를 시작으로 Transformer의 Self-Attention 구조와 PyTorch 학습 루프를 정리한 문서.
slug: what-is-supervised-learning
category: ai
completed: false
---

## 기분류

지도학습을 위해서는 회귀 모델만이 아닌 분류 모델이 필요하다 회귀 모델의 경우 가중치에 가까운 값을 찾는것에 적합하지만 주어진 데이터를 분류하는 것에는 부족하기 때문에 지도학습을 위해서는 회귀, 분류 모델이 필요하다

예를들어, 학생이 공부한 시간을 보고 시험에 합격할지 불합격할지 예측한다고 가정을 하였을 경우 어떻게 예측할 것인지에 대한 것이다. 회귀 모델의 경우 중간 값이 존재하기 때문에 합, 불을 결정 시키지는 못할것이다. 이러한 분류를 위해서는 분류 모델을 적용해야 한다.

### 로지스틱 회귀

주어진 데이터 X를 통해서 사건 발생 확률 Y를 예측하는 통계모델을 의미한다. 기존의 회귀모델은 Linear 한 결과가 예측이 된다.

![Pasted image 20260825101115](/images/ai/Pasted%20image%2020260825101115.png)

이렇게 선형적인 경우 문제가 발생하는 것은 특정 값의 극단의 경우에 어떠한 분포에 속하는지에 대한 분류가 불가능하다는 것이다. 그래서 이 선형적인 모델을 변형하여 선형적인 그래프의 극단을 0~1 사이에서 수렴이 되도록 만든것이 로지스틱 회귀이다.

기존의 회귀학습에서의 결과를 예측하기 위한 수식은 $\hat{y} = xw + b$ 이 수식을 활용한 시그모이드 함수를 활용하여 결과를 예측한다.

![Pasted image 20260825102051](/images/ai/Pasted%20image%2020260825102051.png)

## Transformer 모델

![Pasted image 20260910115943](/images/ai/Pasted%20image%2020260910115943.png)
Attention is all you need 논문에 등제된 RNN이 없는 Seq2Seq(Encoder-Decoder) 인 Transformer 모델을 제시했습니다.

입력 문장을 순차적인 처리에 의존하지 않고, 모든 단어간 관계를 동시에 고려하면서 병렬처리 가능한 Multi-head Self Attention을 기반으로 번역 모델의 학습 시간을 획기적으로 단축시켰습니다.

이후 많은 언어모델뿐만 아니라 Vision 영역까지 활용되며 LLM, Multimodal Model 등의 기반 아키텍처로 자리 잡게 되었다.

#### Encoder

![Pasted image 20260910120803](/images/ai/Pasted%20image%2020260910120803.png)
위의 과정이 Encoder 가 동작하는 방식을 설명한 것입니다.

#### 1. Input Embedding 은 단어를 의미를 가진 숫자 벡터로 변환하는 과정을 의미합니다

```
나는   → [0.2, 0.7, -0.1, ...]
학교에 → [0.8, 0.1,  0.3, ...]
간다   → [0.4, 0.9, -0.2, ...]
```

#### 2. Positional Encoding는 단어의 순서를 알려주는 역할을 수행합니다

Self-Attention 자체는 단어가 몇 번째 있는지에 대한 정보를 모릅니다. 따라서

```
나는   + 1번째 위치 정보
학교에 + 2번째 위치 정보
간다   + 3번째 위치 정보   
```

위와 같이 토큰 단위로 각 단어의 위치에 대한 정보를 기록하는 과정에 Positional Encoding 입니다.

#### 3. Multi-Head Self-Attention는 다른 단어와의 관계를 봅니다

이 단계가Transformer에서 가장 중요한 부분입니다. 예를들어, "학교에"라는 단어를 이해한다고 보겠습니다. Transformer 는 학교에만 혼자 보는 것이 아닌 문장 전체 단어와의 관계를 계산합니다. 이를 다음과 같이 계산을 수행합니다.

```
"나는"을 이해할 때

나는      0.4
학교에    0.1
간다      0.5
```

이 과정에서 Self-Attention 을 수행하고 각 토큰에서 3가지 벡터 값을 생성합니다. 이에 대한 결과를 다음과 같습니다.

```
          Query : 나는 지금 어떤 정보를 찾고 있는가?
나는 ───── Key : 나는 어떤 정보를 가지고 있는가?
          Value : 실제로 전달할 정보는 무엇인가?
```

Query 는 관심도 계산을 위한 개별 기준 단어정보를 의미하고 Key 는 Attention Weights 생성을 위해 Query가 참조하는 벡터들을 의미, Value 는 Context Vector 를 생성하기 위해 Attention Weights를 적용하는 벡터들을 의미합니다.

위의 단어에 대해서 QKV 라고 명명합니다.
$$Q = XW^Q, K = XW^K, V = XW^V$$
위의 계산에서 일반적으로 X 의 값은 Transform 을 수행하는데 이러한 이유는 2차원 데이터의 행렬데이터를 곱할 경우 적어도 X의 열값과 W의 행 값은 일치해야 하기 때문에 행렬의 곱이 가능한 형태로 변형시켜줄 필요가 있습니다.
$$Attention(Q,K,V) = softmax(\frac{QK^T}{\sqrt{d)k}})V$$
이 과정을 넣는 이유는 embedding 차원 $\sqrt{dk}$가 커질수록 내적값이 지나치게 커지고, softmax가 한 토큰에 과도하게 치우쳐 학습이 불안정해질 수 있기 때문입니다.

그리고 노트북의 다음 부분은 수정이 필요합니다
Attention 을 계산하기 위해서는 위와 같이 softmax 를 활용한 수식을 사용할 필요가 있습니다. 위의 과정에 대해서 단계적으로 차근 차근 설명해보고자 합니다.
![Pasted image 20260910134547](/images/ai/Pasted%20image%2020260910134547.png)
우선 Attention 을 계산하기 이전에 선행되어야 하는 Input Embedding, Positional Embedding 을 수행한 결과가 위의 그림과 같은 결과를 만들었습니다. 그리고 QKV 의 값을 구하는 공식 $Q = XW^Q$ 에서 X 값은 임베팅한 결과인 3차원의 벡터 값이이 X에 해당합니다.

이후 이 X 값과 같이 계산해야 하는 $W^Q$, $W^K$, $W^V$ 값은 학습 과정에서 자동으로 찾아지는 학습 파라미터입니다. 예를들어 다음과 같이 생성이 됩니다.

```python
W_Q = nn.Parameter(torch.randn(3, 3))
W_K = nn.Parameter(torch.randn(3, 3))
W_V = nn.Parameter(torch.randn(3, 3))
# W^Q: “무엇을 찾고 있는가?”를 나타내는 Query 표현을 만드는 방법
# W^K: “내가 어떤 정보인가?”를 비교 가능한 Key 표현으로 만드는 방법
# W^V: 실제로 다른 토큰에게 전달할 정보인 Value 표현을 만드는 방법
```

위의 값을 활용하여 각 토큰 Embedding X에서 다음처럼 Q, K, V 를 만듭니다.

```python
W = X @ W_Q
K = X @ W_K
V = X @ W_V
```

학습 초반에는 랜덤값이므로 attention도 의미 없는 패턴입니다. 하지만 loss를 계산하고 역전파하면 PyTorch 는 loss를 줄이는 방향으로 `W_Q`, `W_K`, `W_V`의 원소를 조금씩 바꿉니다.
$$W^Q \leftarrow W^Q - lr \cdot \frac{\partial Loss}{\partial W^Q}$$
`W^K`, `W^V`도 같은 원리로 업데이트됩니다. 많은 학습 반복 뒤에는, 모델이 현재 작업에 유용한 토큰 관계를 attention으로 찾도록 세 행렬의 값이 바뀝니다.

#### 5. Add & Norm

여기서 `Add`는 **Residual Connection**입니다. Attention 결과만 사용하는 것이 아니라 기존 입력도 다시 더합니다.

```md
output = 원래 입력 + Attention 결과
```

그 다음 Layer Normalization, `LayerNorm(x + Attention(x))` 을 수행합니다.

## Multi Head Self Attention

Multi Head Self Attention 이 필요한 이유는 단일 결과를 바탕으로 학습을 수행할 경우 특정 문맥에 대해서 제대로된 이해를 하지 못할 경우가 발생할 수 있기 때문에 단일 케이스가 아닌 여러 관점에서 데이터를 분석하기 위해 Multi Head 을 사용해 학습을 수행합니다.

#### Masked Self Attention vs Self Attention

Self Attention 은 자신을 포함한 모든 토큰을 대상으로 Attention 계산을 수행한다. Masked Self Attention 은 토큰을 대상으로 자신의 토큰을 마스킹으로 가린 후 해당 마스킹 된 값을 예측하는 결과, 확률에 대한 결과를 기반으로 모델을 발전시켜나가는 방식을 Masked Self Attention 이라고 한다.

## 모델학습

기존의 Tensorflow 는 모델 학습이 굉장히 편리하였습니다.

```python
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
    loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
    metrics=["accuracy"],
)
model.fit(train_dataset, epochs=20)
```

위와 같이 compile 설정에서 optimizer 설정에 사용할 함수에 대한 선언, loss 함수에 대한 선언과 epochs 를 설정해주면 내부적으로 모델 학습을 수행할 수 있었습니다. 하지만 PyTorch 에서는 위의 과정을 직접 학습 순서를 정의해야합니다.

PyTorch 에서 모델을 학습하는 단계는 다음과 같습니다.

```md
1. optimizer.zero_grad()
2. 모델 예측
3. loss 계산
4. loss.backward()
5. optimizer.step()
```

위의 각각의 단계에서 어떠한 작업들을 수행하고 왜 필요한지에 대해서 다루어보겠습니다.

#### 1. 기울기 누적의 초기화

PyTorch는 기본적으로 Gradient(기울기)를 자동으로 누적합니다. 즉, 이전 배치에서 계산한 Gardient가 다음 배치의 Gardient에 계속 누적이 된다는 의미입니다.

모델 학습 과정에서 이전의 학습, 평가 했었던 기울기의 값들이 계속해서 누적이 될 경우 의도하지 않은 큰 업데이트가 일어날 수 있기 때문에 일반적인 미니배치 학습에서는 매 배치마다 새로운 gradient만 사용해야 하므로, 학습을 시작하기 전에 기존 gradient를 0으로 초기화합니다.
