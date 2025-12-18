import React from "react";
import { CreaSolicitud } from "../components";
import Layout from "../components/Layout";

const NuevaSolicitud = () => {
    return (
        <>
            <Layout />
            <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
                <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 shadow-xl border-b border-slate-200">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 tracking-tight">
                                    Solicitud de Crédito
                                </h1>
                            </div>
                            <div className="hidden lg:flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-white text-sm font-semibold">Proceso Seguro</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
                        {/* Form Content */}
                        <div className="p-8">
                            <CreaSolicitud />
                        </div>

                        {/* Footer Information */}
                        <div className="bg-slate-50 border-t border-slate-200 px-8 py-6">
                            <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
                                <div className="flex items-center space-x-2 text-slate-600">
                                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm font-medium">Sus datos están protegidos y encriptados @2025</span>
                                </div>
                                <div className="flex items-center space-x-6 text-xs text-slate-500">
                                    <span className="flex items-center space-x-1">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                        <span>SSL Seguro</span>
                                    </span>
                                    <span className="flex items-center space-x-1">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                        </svg>
                                        <span>Cumplimiento Normativo</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NuevaSolicitud;
