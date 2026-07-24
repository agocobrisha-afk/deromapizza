import { Clock3, PackageCheck, ShoppingBag, Truck } from "lucide-react";

const orders = [
  { id: "DR-1024", customer: "طلب واتساب", total: 46, status: "جديد", time: "منذ 5 دقائق" },
  { id: "DR-1023", customer: "طلب مباشر", total: 68, status: "قيد التحضير", time: "منذ 18 دقيقة" },
  { id: "DR-1022", customer: "طلب واتساب", total: 32, status: "جاهز", time: "منذ 35 دقيقة" },
];

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6" dir="rtl">
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <span className="text-xs font-black text-rose-500">الإدارة اليومية</span>
        <h1 className="mt-1 text-3xl font-black text-slate-950">الطلبات</h1>
        <p className="mt-2 text-sm text-slate-500">متابعة حالات الطلبات من الاستلام إلى التسليم.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={ShoppingBag} label="طلبات اليوم" value="3" />
        <Stat icon={Clock3} label="قيد التحضير" value="1" />
        <Stat icon={PackageCheck} label="جاهزة" value="1" />
        <Stat icon={Truck} label="تم التسليم" value="1" />
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="space-y-3">
          {orders.map((order) => (
            <article key={order.id} className="grid gap-4 rounded-2xl border border-slate-200 p-4 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center">
              <div><strong className="block text-slate-950">{order.id}</strong><span className="mt-1 block text-sm text-slate-500">{order.customer}</span></div>
              <b className="text-slate-950">{order.total} د.ل</b>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-black text-rose-600">{order.status}</span>
              <small className="text-slate-500">{order.time}</small>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><Icon size={20} className="text-rose-500" /><span className="mt-4 block text-sm font-bold text-slate-500">{label}</span><strong className="mt-1 block text-3xl font-black text-slate-950">{value}</strong></article>;
}
