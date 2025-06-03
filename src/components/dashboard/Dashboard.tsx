import ShopGrid from './ShopGrid';

const Dashboard = () => {
  return (
    <div className="mt-8">
      <ShopGrid shops={[]} selectedShop={null} onShopSelect={() => {}} />
    </div>
  );
};

export default Dashboard;
