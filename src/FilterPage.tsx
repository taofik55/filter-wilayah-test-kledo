import { useLoaderData, useSearchParams } from "react-router-dom";
import worldIcon from "../public/world.svg";
import provinceIcon from "../public/province.svg";
import regencyIcon from "../public/regency.svg";
import districtIcon from "../public/district.svg";
import dropdownIcon from "../public/dropdown.svg";
import resetIcon from "../public/reset.svg";
import breadcrumbsIcon from "../public/breadcrumbs.svg";
import arrowDownIcon from "../public/arrow-down.svg";

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

// component ada di dalam file FiterPage.tsx karena untuk kebutuhan test yang harus menyertakan satu file .tsx dalam soal
// Combo box component
interface ComboBoxProps {
  name: string; // sesuai soal yang harus ngasih name di combo box
  label: string;
  placeholder?: string;
  value?: string | number;
  options?: Option[];
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  icon?: string;
}

function ComboBox({
  name, // sesuai soal yang harus ngasih name di combo box
  label,
  placeholder,
  value,
  options = [],
  onChange,
  disabled,
  icon,
}: ComboBoxProps) {
  return (
    <div className="combo-box">
      <div className="flex flex-col gap-2 w-[320px]">
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
            className={`w-full appearance-none border border-gray-800 rounded-xl py-3 pr-8 focus:outline-none focus:border-blue-500 bg-transparent font-semibold text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed ${
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
    </div>
  );
}

interface BreadcrumbProps {
  province?: Province;
  regency?: Regency;
  district?: District;
}

function Breadcrumb({ province, regency, district }: BreadcrumbProps) {
  return (
    <div className="breadcrumb">
      <div className="px-8 py-8 flex items-center gap-3 text-sm font-medium text-gray-400 bg-white border-b border-gray-200">
        <span className={!province ? "text-blue-500 font-bold" : ""}>
          Indonesia
        </span>

        {province && (
          <>
            <img src={breadcrumbsIcon} alt="breadcrumbs" className="w-3 h-3" />
            <span className={!regency ? "text-blue-500 font-bold" : ""}>
              {province.name}
            </span>
          </>
        )}

        {regency && (
          <>
            <img src={breadcrumbsIcon} alt="breadcrumbs" className="w-3 h-3" />
            <span className={!district ? "text-blue-500 font-bold" : ""}>
              {regency.name}
            </span>
          </>
        )}

        {district && (
          <>
            <img src={breadcrumbsIcon} alt="breadcrumbs" className="w-3 h-3" />
            <span className="text-blue-500 font-bold">{district.name}</span>
          </>
        )}
      </div>
    </div>
  );
}

// container ada di dalam file FiterPage.tsx karena untuk kebutuhan test yang harus menyertakan satu file .tsx dalam soal
// left panel container
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
  // Transform menjadi bentuk interface option
  const provinceOptions = provinces.map((p) => ({
    label: p.name,
    value: p.id,
  }));
  const regencyOptions = regencies.map((r) => ({
    label: r.name,
    value: r.id,
  }));
  const districtOptions = districts.map((d) => ({
    label: d.name,
    value: d.id,
  }));

  return (
    <div className="left-panel">
      <div className="h-screen p-10 border-r border-gray-200 flex flex-col gap-8 text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#e6f0fa] rounded-xl flex items-center justify-center shrink-0">
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
          className="w-full py-4 px-4 border-2 border-[#155dbd] text-[#374154] rounded-xl font-medium bg-transparent hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <img src={resetIcon} alt="reset" className="h-5 w-5" />
          RESET
        </button>
      </div>
    </div>
  );
}

// right panel container
interface RightPanelProps {
  province?: Province;
  regency?: Regency;
  district?: District;
}

function RightPanel({ province, regency, district }: RightPanelProps) {
  return (
    <div className="right-panel">
      <div className="h-screen flex flex-1 flex-col bg-[#fbfdff]">
        <Breadcrumb province={province} regency={regency} district={district} />
        <div className="flex-1 flex flex-col items-center justify-center pb-20 overflow-y-auto">
          {province ? (
            <div className="flex flex-col items-center gap-10 w-full max-w-4xl px-4">
              <div className="text-center w-full">
                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">
                  Provinsi
                </h3>
                <h1 className="text-5xl md:text-6xl font-bold text-[#0d1629]">
                  {province.name}
                </h1>
              </div>

              {regency && (
                <>
                  <div className="text-gray-200">
                    <img
                      src={arrowDownIcon}
                      alt="arrow down"
                      className="h-6 w-6"
                    />
                  </div>

                  <div className="text-center w-full animate-fade-in-up">
                    <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">
                      Kota / Kabupaten
                    </h3>
                    <h1 className="text-5xl md:text-6xl font-bold text-[#0d1629]">
                      {regency.name}
                    </h1>
                  </div>
                </>
              )}

              {district && (
                <>
                  <img
                    src={arrowDownIcon}
                    alt="arrow down"
                    className="h-6 w-6"
                  />

                  <div className="text-center w-full animate-fade-in-up">
                    <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">
                      Kecamatan
                    </h3>
                    <h1 className="text-5xl md:text-6xl font-bold text-[#0d1629]">
                      {district.name}
                    </h1>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-300">
              <p className="text-lg">Silakan pilih wilayah</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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

  // Selected Objects
  const selectedProvince = data.provinces.find(
    (p) => p.id === selectedProvinceId,
  );
  const selectedRegency = data.regencies.find(
    (r) => r.id === selectedRegencyId,
  );
  const selectedDistrict = data.districts.find(
    (d) => d.id === selectedDistrictId,
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
          <RightPanel
            province={selectedProvince}
            regency={selectedRegency}
            district={selectedDistrict}
          />
        </div>
      </div>
    </main>
  );
}
