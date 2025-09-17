<script lang="ts">
  import { onMount } from "svelte";
  import * as v from "valibot";
  // 保存データを localStorage から読み込み
  const Record = v.object({
    lender: v.string(),
    borrower: v.string(),
    amount: v.number(),
    note: v.string(),
    date: v.string(),
    paid: v.boolean(),
  });
  const Records = v.array(Record);
  type Records = v.InferOutput<typeof Records>;

  let records = $state<Records>([]);

  onMount(() => {
    records = v.parse(
      Records,
      JSON.parse(localStorage.getItem("records") || "[]")
    );
  });

  let lender = $state("");
  let borrower = $state("");
  let amount = $state<number | null>(null);
  let note = $state("");

  function addRecord() {
    if (lender && borrower) {
      const newRecord = {
        lender,
        borrower,
        amount: Number(amount),
        note,
        date: new Date().toLocaleDateString(),
        paid: false,
      };

      records = [...records, newRecord];
      localStorage.setItem("records", JSON.stringify(records));

      lender = "";
      borrower = "";
      amount = null;
      note = "";
    }
  }

  function togglePaid(index: number) {
    records = records.map((r, i) =>
      i === index ? { ...r, paid: !r.paid } : r
    );
    localStorage.setItem("records", JSON.stringify(records));
  }
</script>

<h1>貸し借り記録アプリ</h1>

<form
  onsubmit={(e) => {
    e.preventDefault();
    addRecord();
  }}
>
  <input bind:value={lender} placeholder="貸した人" required />
  <input bind:value={borrower} placeholder="借りた人" required />
  <input type="number" bind:value={amount} placeholder="金額" required />
  <input bind:value={note} placeholder="メモ (任意)" />
  <button type="submit">追加</button>
</form>

{#each records as record, i (i)}
  <div class="record">
    <p class={record.paid ? "paid" : ""}>
      {record.date} | {record.lender} → {record.borrower} | {record.amount}円
    </p>
    {#if record.note}
      <p>メモ: {record.note}</p>
    {/if}
    <button onclick={() => togglePaid(i)}>
      {record.paid ? "未精算に戻す" : "精算済みにする"}
    </button>
  </div>
{/each}

<style>
  form {
    margin-bottom: 1rem;
  }
  input,
  button {
    margin: 0.3rem;
    padding: 0.5rem;
  }
  .record {
    border-bottom: 1px solid #ccc;
    padding: 0.5rem 0;
  }
  .paid {
    color: gray;
    text-decoration: line-through;
  }
</style>
