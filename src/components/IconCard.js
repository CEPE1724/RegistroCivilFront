import { ArrowDropUp, ArrowDropDown } from '@mui/icons-material'; // Importar iconos de MUI

const IconCard= () => {
  return (
    <div className="grid grid-cols-2 w-[700px] gap-2 max-[500px]:grid-cols-1 px-3">
      <div className="group w-full rounded-lg bg-[#673ab7] p-5 transition relative duration-300 cursor-pointer hover:translate-y-[3px] hover:shadow-[0_-8px_0px_0px_#2196f3]">
        <p className="text-white text-2xl">2000</p>
        <p className="text-white text-sm">lorem</p>
        
        <ArrowDropUp className="group-hover:opacity-100 absolute right-[10%] top-[50%] translate-y-[-50%] opacity-20 transition group-hover:scale-110 duration-300 w-9 h-9 text-white" />
      </div>

      <div className="group w-full rounded-lg bg-[rgb(41,49,79)] p-5 transition relative duration-300 cursor-pointer hover:translate-y-[3px] hover:shadow-[0_-8px_0px_0px_rgb(244,67,54)]">
        <p className="text-white text-2xl">1999</p>
        <p className="text-white text-sm">lorem</p>

        <ArrowDropDown className="group-hover:opacity-100 absolute right-[10%] top-[50%] translate-y-[-50%] opacity-20 transition group-hover:scale-110 duration-300 w-9 h-9 text-white" />
      </div>
    </div>
  );
};

export default IconCard;
