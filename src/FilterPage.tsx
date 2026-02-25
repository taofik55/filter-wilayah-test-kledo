import { useLoaderData, useSearchParams } from "react-router-dom";
import worldIcon from "../public/world.svg";
import provinceIcon from "../public/province.svg";
import regencyIcon from "../public/regency.svg";
import districtIcon from "../public/district.svg";
import dropdownIcon from "../public/dropdown.svg";

// interfaces untuk dummy json
interface Province {
  id: number;
  name: string;
}
interface Regency {
  id: number;
  name: string;
  province_id: number;
}
interface District {
  id: number;
  name: string;
  regency_id: number;
}
interface RegionData {
  provinces: Province[];
  regencies: Regency[];
  districts: District[];
}

// fungsi loader ada di dalam file FiterPage.tsx karena untuk kebutuhan test yang harus menyertakan satu file .tsx dalam soal
// eslint-disable-next-line react-refresh/only-export-components
export async function loader() {
  const response = await fetch("/data/indonesia_regions.json");
  return response.json();
}

interface Option {
  label: string;
  value: string | number;
}

interface ComboBoxProps {
  name: string;
  label: string;
  placeholder?: string;
  value?: string | number;
  options?: Option[];
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  icon?: string;
}

function ComboBox({
  name,
  label,
  placeholder,
  value,
  options = [],
  onChange,
  disabled,
  icon,
}: ComboBoxProps) {
  return (
    <div className="flex flex-col gap-2 w-[300px]">
      <label className="text-md font-bold text-gray-500 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <img src={icon} alt="" className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <select
          name={name}
          className={`w-full appearance-none border border-gray-800 rounded-xl py-3 pr-8 focus:outline-none focus:border-blue-500 bg-white text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed ${
            icon ? "pl-10" : "px-4"
          }`}
          value={value}
          onChange={onChange}
          disabled={disabled}
        >
          <option value="">{placeholder || "Select..."}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-200">
          <img src={dropdownIcon} alt="dropdown" className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

interface LeftPanelProps {
  provinces: Province[];
  regencies: Regency[];
  districts: District[];
  selectedProvinceId: number | "";
  selectedRegencyId: number | "";
  selectedDistrictId: number | "";
  onProvinceChange: (id: number | "") => void;
  onRegencyChange: (id: number | "") => void;
  onDistrictChange: (id: number | "") => void;
  onReset: () => void;
}

// container ada di dalam file FiterPage.tsx karena untuk kebutuhan test yang harus menyertakan satu file .tsx dalam soal
// left panel component
function LeftPanel({
  provinces,
  regencies,
  districts,
  selectedProvinceId,
  selectedRegencyId,
  selectedDistrictId,
  onProvinceChange,
  onRegencyChange,
  onDistrictChange,
  onReset,
}: LeftPanelProps) {
  // Transform to options
  const provinceOptions = provinces.map((p) => ({
    label: p.name,
    value: p.id,
  }));
  const regencyOptions = regencies.map((r) => ({ label: r.name, value: r.id }));
  const districtOptions = districts.map((d) => ({
    label: d.name,
    value: d.id,
  }));

  return (
    <div className="h-screen p-10 border-r border-gray-200 flex flex-col gap-8 text-left">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-[#e6f0fa] rounded-xl flex items-center justify-center shrink-0">
          <img src={worldIcon} alt="world" />
        </div>
        <span className="font-bold text-2xl text-gray-800">
          Frontend Assessment
        </span>
      </div>

      <div className="flex flex-col gap-8 mt-8">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          Filter Wilayah
        </h3>

        <ComboBox
          name="province" // sesuai soal yang harus ngasih name di combo box
          label="Provinsi"
          placeholder="Pilih Provinsi"
          options={provinceOptions}
          value={selectedProvinceId}
          onChange={(e) => onProvinceChange(Number(e.target.value) || "")}
          icon={provinceIcon}
        />
        <ComboBox
          name="regency" // sesuai soal yang harus ngasih name di combo box
          label="Kota/Kabupaten"
          placeholder="Pilih Kota/Kabupaten"
          options={regencyOptions}
          value={selectedRegencyId}
          onChange={(e) => onRegencyChange(Number(e.target.value) || "")}
          disabled={!selectedProvinceId}
          icon={regencyIcon}
        />
        <ComboBox
          name="district" // sesuai soal yang harus ngasih name di combo box
          label="Kecamatan"
          placeholder="Pilih Kecamatan"
          options={districtOptions}
          value={selectedDistrictId}
          onChange={(e) => onDistrictChange(Number(e.target.value) || "")}
          disabled={!selectedRegencyId}
          icon={districtIcon}
        />
      </div>

      <hr />
      <button
        onClick={onReset}
        className="w-full py-2.5 px-4 border border-blue-500 text-blue-600 rounded-full font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        RESET
      </button>
    </div>
  );
}
// right panel component
function RightPanel() {
  return (
    <div className="right-panel">
      <h2>Wilayah</h2>
    </div>
  );
}

// search params logic
// derived filtering
// reset handler

// render UI
export default function FilterPage() {
  const data = useLoaderData() as RegionData;
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedProvinceId = searchParams.get("province")
    ? Number(searchParams.get("province"))
    : "";
  const selectedRegencyId = searchParams.get("regency")
    ? Number(searchParams.get("regency"))
    : "";
  const selectedDistrictId = searchParams.get("district")
    ? Number(searchParams.get("district"))
    : "";

  // Derived filtered data
  const filteredRegencies = data.regencies.filter(
    (regency) => regency.province_id === selectedProvinceId,
  );
  const filteredDistricts = data.districts.filter(
    (district) => district.regency_id === selectedRegencyId,
  );

  // Handlers
  const handleProvinceChange = (id: number | "") => {
    const params = new URLSearchParams(searchParams);

    if (id === "") {
      params.delete("province");
      params.delete("regency");
      params.delete("district");
    } else {
      params.set("province", String(id));
      params.delete("regency");
      params.delete("district");
    }

    setSearchParams(params);
  };

  const handleRegencyChange = (id: number | "") => {
    const params = new URLSearchParams(searchParams);

    if (id === "") {
      params.delete("regency");
      params.delete("district");
    } else {
      params.set("regency", String(id));
      params.delete("district");
    }

    setSearchParams(params);
  };

  const handleDistrictChange = (id: number | "") => {
    const params = new URLSearchParams(searchParams);

    if (id === "") {
      params.delete("district");
    } else {
      params.set("district", String(id));
    }

    setSearchParams(params);
  };

  const handleReset = () => {
    setSearchParams({});
  };

  return (
    <main>
      <div className="grid grid-cols-4">
        <div className="col-span-1">
          <LeftPanel
            provinces={data.provinces}
            regencies={filteredRegencies}
            districts={filteredDistricts}
            selectedProvinceId={selectedProvinceId}
            selectedRegencyId={selectedRegencyId}
            selectedDistrictId={selectedDistrictId}
            onProvinceChange={handleProvinceChange}
            onRegencyChange={handleRegencyChange}
            onDistrictChange={handleDistrictChange}
            onReset={handleReset}
          />
        </div>
        <div className="col-span-3">
          <RightPanel />
        </div>
      </div>
    </main>
  );
}
